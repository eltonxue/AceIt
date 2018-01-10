var express = require('express');
var router = express.Router();
var sequelize = require('sequelize');
var fs = require('fs');

var Op = sequelize.Op;

const db = require('../database/models/index');

const User = db.User;
const QuestionBank = db.QuestionBank;
const Feedback = db.Feedback;

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
  // Get all feedback with session user's ID

  db.sequelize
    .query(
      `SELECT * FROM "Feedbacks" WHERE "UserId" = ${req.session.user.id}`,
      {
        type: sequelize.QueryTypes.SELECT
      }
    )
    .then(history => {
      // Replace history with buffer/stream
      let results = history.map(function(feedback) {
        feedback.audio = fs.readFileSync(feedback.path);
        delete feedback.path;
        return feedback;
      });
      console.log('-----UPDATED HISTORY-----');
      console.log(results);
      res.json(results);
    })
    .catch(err => console.log(err));
});

// Get session user's question banks
router.get('/bank=:bankId', function(req, res, next) {
  const { bankId } = req.params;
  return QuestionBank.findOne({
    where: { id: bankId }
  })
    .then(bank => res.send(bank))
    .catch(err => res.send(err));
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

// Get user based on username
router.get('/get/:username', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
