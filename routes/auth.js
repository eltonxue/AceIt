var express = require('express');
var User = require('../models/user');
var models = require('../sequelize');
var router = express.Router();

var User = models.user;

// Logs the user in as a session user
router.post('/login', function(req, res, next) {
  res.send('login');
});

// Signs the user up in as a session user
router.post('/register', function(req, res, next) {
  // Gather data
  const data = req.body;
  const username = data.username;
  const password = data.password;
  const email = data.email;
  const history = [];
  const questionBanks = [];

  // Create a user given the data
  const userData = { username, password, email, history, questionBanks };

  // User.create(userData)
  //   .then(function(user) {
  //     console.log(user);
  //     user.save;
  //   })
  //   .catch(function(err) {
  //     console.log(err);
  //   });

  // User.findAll().then(users => {
  //   console.log(users);
  //   res.send(users);
  // });
});

// Logs the user out of their session
router.get('/logout', function(req, res, next) {
  res.render('index');
});

module.exports = router;
