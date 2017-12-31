var express = require('express');
var router = express.Router();

const models = require('../database/models/index');

const User = models.User;
const QuestionBank = models.QuestionBank;
const Feedback = models.Feedback;

// Logs the user in as a session user
router.post('/login', function(req, res, next) {
  const data = req.body;
  console.log(
    `LOGGING IN username: ${data.username}, password: ${data.password}`
  );

  User.findOne({ where: { username: data.username } }).then(function(user) {
    console.log(user);
    if (!user) {
      res.send({ type: 'username', error: 'User does not exist' });
    } else {
      if (data.password === user.password) {
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
  const data = req.body;
  console.log(
    `REGISTERING username: ${data.username}, password: ${data.password}`
  );
  // Check email
  let reg = /\S+@\S+\.\S+/;
  if (!reg.test(data.email)) {
    res.send({ type: 'email', error: 'Invalid email' });
  } else if (data.password.length <= 6 || data.confirmPassword.length <= 6) {
    res.send({
      type: 'password',
      error: 'Password must be greater than 6 characters'
    });
  } else if (data.password !== data.confirmPassword) {
    // Check passwords
    res.send({ type: 'password', error: 'Passwords must match' });
  } else {
    // Check if username or email exists
    User.findOne({ where: { username: data.username } })
      .then(invalidUsername => {
        if (invalidUsername) {
          res.send({ type: 'username', error: 'Username already exists' });
        } else {
          User.findOne({ where: { email: data.email } })
            .then(invalidEmail => {
              if (invalidEmail) {
                res.send({ type: 'email', error: 'Email already exists' });
              } else {
                const userData = {
                  username: data.username,
                  password: data.password,
                  email: data.email,
                  QuestionBanks: {
                    title: 'Example Question Bank',
                    questions: [
                      'Tell me about yourself.',
                      'Why do you want to work for us?',
                      'Do you have any questions?'
                    ]
                  },
                  Feedbacks: {}
                };

                // Create a user given the data (history and questionBanks values created by default)
                return User.create(userData, {
                  include: [
                    { model: QuestionBank, as: 'QuestionBanks' },
                    { model: Feedback, as: 'Feedbacks' }
                  ]
                })
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
