var express = require('express');
var router = express.Router();

const Question = require('../database/models/index').Question;

// Gets all questions
router.get('/all', function(req, res, next) {
  res.send('respond with a resource');
});

// Get top 3 most recent questions
router.get('/all', function(req, res, next) {
  res.send('respond with a resource');
});

// Post new question with given data
router.post('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Delete oldest question

module.exports = router;
