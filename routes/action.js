var express = require('express');
var router = express.Router();

const User = require('../database/models/index').User;
const QuestionBank = require('../database/models/index').QuestionBank;

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
  console.log(req.session.user);
  console.log(req.session.user.id);
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

  QuestionBank.destroy({ where: { id: bankId } }).then(() =>
    res.send('Delete Successful')
  );
});

// Update question bank title w/ bank id
router.patch('/bank/update-title', function(req, res, next) {
  const data = req.body;
});

// Add question to question bank w/ bank id
router.patch('/bank/add-question', function(req, res, next) {
  const data = req.body;
});

// Remove question from question bank w/ bank id
router.patch('/bank/add-question', function(req, res, next) {
  const data = req.body;
});

module.exports = router;
