//jshint esversion:6
require('dotenv').config();
// console.log(process.env) // remove this after you've confirmed it working
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const flash = require('connect-flash');
// passport-local, a package which provides a strategy for authenticating with a username and password

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/secretDB");
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  facebookId: String,
  secret: String
})

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model('User', userSchema);
// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
// // this just for local strategy
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//// and this for all strategies
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  })
});

// The Google authentication strategy authenticates users using a Google account and OAuth 2.0 tokens.
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// The Facebook authentication strategy authenticates users using a Facebook account and OAuth 2.0 tokens.
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets",
    profileFields: ['id', 'displayName', 'photos', 'email', 'name', 'gender']
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.route("/").get((req, res) =>{
  res.render('home');
  })

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] }));


app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }), function(req, res) {
      // Successful authentication, redirect to secrets page.
      res.redirect("/secrets");
    });

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });


app.route("/login")
  .get((req, res) =>{
    const message = String(req.flash('error'));
    res.render('login', {feedback: message});
  })

  // .post((req, res)=>{
  //   const user = new User({
  //     username: req.body.username,
  //     password: req.body.password
  //   });
  //
  //   req.login(user, function(err){
  //     if(err){
  //       console.log(err);
  //     } else {
  //       passport.authenticate("local")(req, res,function(){
  //         res.redirect('/secrets');
  //       });
  //     }
  //   })
  //
  // })

  // Or use this code
  .post(passport.authenticate("local",{
    successRedirect: "/secrets",
    failureRedirect: "/login",
    failureFlash: true,
    // add this option to customize error message
    // failureFlash: 'Custom Error'
  }), function(err, user){

  });


app.route("/register")
  .get((req, res) =>{
    res.render('register');
  })

  .post((req, res) =>{
    User.register({username: req.body.username}, req.body.password, function(err, user){
      if(err){
        console.log(err);
        res.redirect('/register');
      } else {
        passport.authenticate('local')(req, res, function(){
          res.redirect("/secrets");
        })
      }
    })
  })

app.route("/secrets")
  .get((req, res)=>{
    User.find({"secret": {$ne: null}}, (err, foundUsers)=>{
      if(!err) {
        res.render('secrets', {usersWithSecrets: foundUsers});
      }
    })
  })

app.route("/submit")
  .get((req, res)=>{
    if(req.isAuthenticated()) {
      res.render('submit');
    } else {
      res.redirect('/login');
    }
  })

  .post((req, res)=>{
    const submittedSecret = req.body.secret;
    User.updateOne({_id: req.user._id}, {secret: submittedSecret}, (err, user)=>{
      if (err) {
        console.log(err);
      } else {
        res.redirect('secrets');
      }
    });
  });

app.route("/logout")
  .get((req, res)=>{
    req.logout(function(){
      res.redirect('/');
    });

  })

app.listen(3000, ()=>{
  console.log('the server running on port ' + 3000)
})
