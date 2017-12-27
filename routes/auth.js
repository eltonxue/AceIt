var express = require('express');
var router = express.Router();

// const UsersController = require('../controllers/index').users;
const User = require('../models/index').User;

// Logs the user in as a session user
router.post('/login', function(req, res, next) {
  res.send('login');
});

// Signs the user up in as a session user
router.post('/register', function(req, res, next) {
  const userData = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  };

  // Create a user given the data (history and questionBanks values created by default)
  return User.create(userData)
    .then(user => res.send(user))
    .catch(err => res.send(err));
});

// Logs the user out of their session
router.get('/logout', function(req, res, next) {
  res.render('index');
});

module.exports = router;
