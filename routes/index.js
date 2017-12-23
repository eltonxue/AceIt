var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { loggedIn: false });
});

// Gets registration page
router.get('/register', function(req, res, next) {
  res.render('register');
});

// Gets login page
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/question-banks', function(req, res, next) {
  res.render('question-banks');
});

router.get('/history', function(req, res, next) {
  res.render('history');
});

router.get('/practice', function(req, res, next) {
  res.render('practice');
});

router.get('/my-account', function(req, res, next) {
  res.render('my-account');
});

module.exports = router;