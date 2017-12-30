var express = require('express');
var router = express.Router();

var auth = require('../utils/session');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.session.user });
});

// Gets registration page
router.get('/register', function(req, res, next) {
  res.render('register');
});

// Gets login page
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/profile/:username', function(req, res, next) {
  // Gather user's info
  let questionBanks;
  // Redirect to user's page
  res.render('user-profile', { questionBanks });
});

// Process requireLogin middleware here
router.use(auth.requireLogin);

router.get('/question-banks', function(req, res, next) {
  res.render('question-banks');
});

router.get('/history', function(req, res, next) {
  res.render('history');
});

router.get('/practice', function(req, res, next) {
  res.render('practice');
});

router.get('/user', function(req, res, next) {
  res.render('user-profile');
});

router.get('/search-results', function(req, res, next) {
  res.render('search-results');
});

router.get('/my-account', function(req, res, next) {
  res.render('my-account');
});

module.exports = router;
