var express = require('express');
var router = express.Router();

const User = require('../database/models/index').User;

// Get session user
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Get all users
router.get('/all', function(req, res, next) {
  res.send('respond with a resource');
});

// Get session user's history ordered based on date
router.get('/history', function(req, res, next) {
  res.send('respond with a resource');
});

// Get session user's question bank
router.get('/banks', function(req, res, next) {
  res.send('respond with a resource');
});

// Get users with search input
router.get('/search/:input', function(req, res, next) {
  res.send('respond with a resource');
});

// Get user's question bank based on username
router.get('/get/banks/:username', function(req, res, next) {
  res.send('respond with a resource');
});

// Get user based on username
router.get('/get/:username', function(req, res, next) {
  res.send('respond with a resource');
});

// Patch session user with data
// - update password
router.patch('/password', function(req, res, next) {
  const data = req.body;
  console.log(req.session.user);
  if (data.newPassword.length <= 6 || data.confirmNewPassword.length <= 6) {
    res.send({
      type: 'new-password',
      error: 'Passwords must be greater than 6 characters'
    });
  } else if (data.newPassword !== data.confirmNewPassword) {
    res.send({ type: 'new-password', error: 'Passwords must match' });
  }
  if (req.session.user.password !== data.oldPassword) {
    res.send({ type: 'old-password', error: 'Wrong password' });
  } else {
    User.update(
      { password: data.newPassword },
      {
        where: { username: req.session.user.username },
        returning: true,
        plain: true
      }
    )
      .then(results => {
        req.session.user.password = data.newPassword;
        res.send(results[1].dataValues);
      })
      .catch(err => res.send(err));
  }
});
// - new Feedback to history
router.patch('/history', function(req, res, next) {
  res.send('respond with a resource');
});
// - update question banks
router.patch('/banks', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
