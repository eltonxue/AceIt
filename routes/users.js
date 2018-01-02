var express = require('express');
var router = express.Router();
var sequelize = require('sequelize');

var Op = sequelize.Op;

const models = require('../database/models/index');

const User = models.User;
const QuestionBank = models.QuestionBank;

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

// Get session user's question banks
router.get('/banks', function(req, res, next) {
  return QuestionBank.findAll({ where: { UserId: req.session.user.id } })
    .then(banks => res.send(banks))
    .catch(err => res.send(err));
});

// Get session user's question banks based on input
router.get('/banks/search=:input', function(req, res, next) {
  let { input } = req.params;
  input = input.toLowerCase();
  console.log(input);

  QuestionBank.findAll({
    where: { UserId: req.session.user.id, title: { [Op.iLike]: `%${input}%` } }
  })
    .then(banks => res.send(banks))
    .catch(err => res.send(err));
});

// Get users with search input
router.get('/search=:input', function(req, res, next) {
  res.send('respond with a resource');
});

// Get user's question banks based on username
router.get('/get/banks/:username', function(req, res, next) {
  res.send('respond with a resource');
});

// Get user based on username
router.get('/get/:username', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
