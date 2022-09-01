//jshint esversion:6
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/secretDB");
const userSchema = new mongoose.Schema({
  email: {
     type: String,
     required: true
   },
  password: {
    type: String,
    required: true
  }
})
const secret = "thisismyownsecretkey,pleasedon'tuseit."
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

const User = mongoose.model('User', userSchema);

app.route('/').get((req, res) =>{
  res.render('home');
  })

app.route('/login')
  .get((req, res) =>{
    res.render('login');
  })

  .post((req, res)=>{
    email = req.body.username;
    password = req.body.password;
    User.findOne({ email: email}, (err, user) =>{
      if(err){
        console.log(err);
      } else {
        if(user){
          if(user.password === password){
            res.render('secrets')
          } else {
            res.send('Password is incorrect!')
          }
        } else {
          res.send('email is incorrect');
        }
      }
    })
  })


app.route('/register')
  .get((req, res) =>{
    res.render('register');
  })

  .post((req, res) =>{
    newUser = new User({email: req.body.username, password: req.body.password});
    newUser.save((err) =>{
      if(err){
        console.log(err);
      } else {
        res.render('secrets');
      }
    });
  })

app.listen(3000, ()=>{
  console.log('the server running on port ' + 3000)
})
