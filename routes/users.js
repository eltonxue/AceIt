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

module.exports = router;
