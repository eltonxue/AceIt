var express = require('express');
var router = express.Router();

// const UsersController = require('../controllers/index').users;
const User = require('../database/models/index').User;

// Logs the user in as a session user
router.post('/login', function(req, res, next) {
  console.log(
    `LOGGING IN username: ${req.body.username}, password: ${req.body.password}`
  );

  User.findOne({ where: { username: req.body.username } }).then(function(user) {
    console.log(user);
    if (!user) {
      res.send({ type: 'username', error: 'User does not exist' });
    } else {
      if (req.body.password === user.password) {
        // sets a cookie with the user's info
        req.session.user = user;
        res.send({ redirect: '/' });
      } else {
        res.send({ type: 'password', error: 'Incorrect password' });
      }
    }
  });
});

// Signs the user up in as a session user
router.post('/register', function(req, res, next) {
  console.log(
    `REGISTERING username: ${req.body.username}, password: ${req.body.password}`
  );
  // Check email
  let reg = /\S+@\S+\.\S+/;
  if (!reg.test(req.body.email)) {
    res.send({ type: 'email', error: 'Invalid email' });
  } else if (req.body.password !== req.body.confirmPassword) {
    // Check passwords
    res.send({ type: 'password', error: 'Passwords must match' });
  } else if (
    req.body.password.length < 6 ||
    req.body.confirmPassword.length < 6
  ) {
    res.send({
      type: 'password',
      error: 'Password must be greater than 6 characters'
    });
  } else {
    // Check if username or email exists
    User.findOne({ where: { username: req.body.username } })
      .then(invalidUsername => {
        if (invalidUsername) {
          res.send({ type: 'username', error: 'Username already exists' });
        } else {
          User.findOne({ where: { email: req.body.email } })
            .then(invalidEmail => {
              if (invalidEmail) {
                res.send({ type: 'email', error: 'Email already exists' });
              } else {
                const userData = {
                  username: req.body.username,
                  password: req.body.password,
                  email: req.body.email
                };

                // Create a user given the data (history and questionBanks values created by default)
                return User.create(userData)
                  .then(user => res.send(user))
                  .catch(err => res.send(err));
              }
            })
            .catch(err => res.send(err));
        }
      })
      .catch(err => res.send(err));
  }
});

// Logs the user out of their session
router.get('/logout', function(req, res, next) {
  req.session.reset();
  res.redirect('/');
});

module.exports = router;
