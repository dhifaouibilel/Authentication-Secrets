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
// passport-local, a package which provides a strategy for authenticating with a username and password

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'))
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
  password: String
})

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);
// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.route('/').get((req, res) =>{
  res.render('home');
  })

app.route('/login')
  .get((req, res) =>{
    res.render('login');
  })

  .post((req, res)=>{
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });

    req.login(user, function(err){
      if(err){
        console.log(err);
      } else {
        passport.authenticate("local")(req, res,function(){
          res.redirect('/secrets');
        });
      }
    })

  })

  //// Or use this code
  // .post(passport.authenticate("local",{
  //   successRedirect: "/secrets",
  //   failureRedirect: "/login"
  //   }), function(req, res){
  //
  // });


app.route('/register')
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
          res.redirect('/secrets');
        })
      }
    })
  })

app.route('/secrets')
  .get((req, res)=>{
    if(req.isAuthenticated()) {
      res.render('secrets');
    } else {
      res.redirect('/login');
    }
  })

app.route('/logout')
  .get((req, res)=>{
    req.logout();
    res.redirect('/');
  })

app.listen(3000, ()=>{
  console.log('the server running on port ' + 3000)
})
