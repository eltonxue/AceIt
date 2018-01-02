var express = require('express');
var router = express.Router();
var sequelize = require('sequelize');

const models = require('../database/models/index');

const User = models.User;
const QuestionBank = models.QuestionBank;

// Update password
router.patch('/update-password', function(req, res, next) {
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

// Add new Feedback to history
router.post('/feedback', function(req, res, next) {
  const data = req.body;
});

// Add new Question Bank
router.post('/bank', function(req, res, next) {
  const data = req.body;
  return QuestionBank.create({
    UserId: req.session.user.id,
    title: 'New Bank',
    questions: []
  })
    .then(bank => res.send(bank))
    .catch(err => res.send(err));
});

// Delete Question Bank w/ bank id
router.delete('/bank', function(req, res, next) {
  const bankId = parseInt(req.query.bankId);

  return QuestionBank.destroy({ where: { id: bankId } })
    .then(() => res.send('Delete Successful'))
    .catch(err => res.send(err));
});

// Update question bank title w/ bank id
router.patch('/bank/update-title', function(req, res, next) {
  const data = req.body;
  const { bankId, newTitle } = data;
  return QuestionBank.update(
    { title: newTitle },
    { where: { id: bankId }, returning: true, plain: true }
  )
    .then(results => res.send(results[1].dataValues))
    .catch(err => res.send(err));
});

// Add question to question bank w/ bank id
router.patch('/bank/add-question', function(req, res, next) {
  const data = req.body;
  const { bankId, question } = data;

  return QuestionBank.update(
    {
      questions: sequelize.fn(
        'array_append',
        sequelize.col('questions'),
        question
      )
    },
    { where: { id: bankId }, returning: true, plain: true }
  )
    .then(results => res.send(results[1].dataValues))
    .catch(err => res.send(err));
});

// Remove question from question bank w/ bank id
router.patch('/bank/remove-question', function(req, res, next) {
  const data = req.body;
  const { bankId, question } = data;

  return QuestionBank.findById(bankId)
    .then(bank => {
      let questions = bank.questions;
      questions.splice(questions.indexOf(question), 1);
      QuestionBank.update(
        { questions },
        { where: { id: bankId }, returning: true, plain: true }
      )
        .then(results => res.send(results[1].dataValues))
        .catch(err => res.send(err));
    })
    .catch(err => res.send(err));
});

module.exports = router;
