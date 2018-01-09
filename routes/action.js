var express = require('express');
var router = express.Router();
var sequelize = require('sequelize');
var fs = require('fs');
var axios = require('axios');
var multer = require('multer');
var upload = multer({ dest: './public/recordings' });

var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const db = require('../database/models/index');

const User = db.User;
const QuestionBank = db.QuestionBank;
const Feedback = db.Feedback;

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

  db.sequelize
    .query(
      `INSERT INTO "Feedbacks"("question","UserId", "createdAt", "updatedAt") VALUES ('it works!!!', ${req
        .session.user.id}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
      { type: sequelize.QueryTypes.INSERT }
    )
    .then(results => {
      res.send(results[0][0]);
    })
    .catch(err => res.send(err));
});

router.patch('/feedback/update', upload.single('blob'), function(
  req,
  res,
  next
) {
  const data = req.body;

  console.log(req.file);
  console.log(data);

  const filePath = `${__dirname}/../public/recordings/${data.name}.flac`;

  fs.renameSync(
    `${__dirname}/../public/recordings/${req.file.filename}`,
    filePath
  );

  // Retrieves data from API
  var speech_to_text = new SpeechToTextV1({
    username: '6a88e235-4937-46cd-8f93-646fccbea760',
    password: 'LvDs4WmdjNH2'
  });
  let params = {
    content_type: 'audio/wav'
  };

  var recognizeStream = speech_to_text.createRecognizeStream(params);

  fs.createReadStream(filePath).pipe(recognizeStream);

  recognizeStream.pipe(
    fs.createWriteStream('./public/recordings/transcription.txt')
  );

  recognizeStream.setEncoding('utf8'); // to get strings instead of Buffers from `data` events

  let transcript = '';
  ['data', 'error', 'close'].forEach(function(eventName) {
    recognizeStream.on(eventName, function(results) {
      if (eventName === 'data') {
        transcript += results;
      } else if (eventName === 'close') {
        // READ FROM TRANSCRIPT FILE
        console.log('Transcript: ' + transcript);
        let arr = transcript.split(' ');
        arr = arr.map((current, i) => {
          // Average sentence length = 10, 14
          return i % 7 === 0 && i !== 0 ? `${current}.` : current;
        });

        transcript = arr.join(' ');
        console.log('Transcript updated: ' + transcript);

        var tone_analyzer = new ToneAnalyzerV3({
          username: '8be17060-7d16-4dde-b8db-2f789916806c',
          password: 'pxQuQ0lbWszM',
          version_date: '2017-09-21'
        });

        tone_analyzer.tone(
          {
            tone_input: transcript,
            content_type: 'text/plain'
          },
          function(err, results) {
            let parsedTones = {
              Anger: 0.05,
              Fear: 0.05,
              Joy: 0.05,
              Sadness: 0.05,
              Analytical: 0.05,
              Confident: 0.05,
              Tentative: 0.05
            };
            if (err) {
              // Send default
              res.send(parsedTones);
            } else {
              let tones = results.document_tone.tones;
              console.log(tones);

              tones.forEach(function(tone) {
                parsedTones[tone.tone_name] = tone.score;
              });

              const nameSplit = data.name.split('-');
              const userId = nameSplit[0];
              const feedbackId = nameSplit[1];
              db.sequelize
                .query(
                  `UPDATE "Feedbacks" SET ("path", "question", "anger","fear","joy","sadness","analytical","confident","tentative","updatedAt") = ('${filePath}', '${data.question}', ${parsedTones.Anger}, ${parsedTones.Fear}, ${parsedTones.Joy}, ${parsedTones.Sadness}, ${parsedTones.Analytical}, ${parsedTones.Confident}, ${parsedTones.Tentative}, CURRENT_TIMESTAMP) WHERE id = ${feedbackId} RETURNING *`,
                  { type: sequelize.QueryTypes.UPDATE }
                )
                .then(feedback => {
                  console.log(feedback);
                  res.json(parsedTones);
                });
            }
          }
        );
      }
    });
  });

  // db.sequelize.query('UPDATE "Feedbacks"("question")')
});

// Add new Question Bank
router.post('/bank', function(req, res, next) {
  const data = req.body;
  return QuestionBank.create({
    UserId: req.session.user.id,
    title: data.title,
    questions: data.questions
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
