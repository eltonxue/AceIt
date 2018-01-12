const test = require('./test.js');
const { chai, server, agent, should } = test;

const db = require('../database/models/index');
const { User, QuestionBank, Feedback, Question } = db;

/*
Test 'actions' route
  - /action/update-password PATCH
  - /action/feedback POST
  - /action/feedback/api PATCH
  - /action/feedback/clear DELETE
  - /action/bank POST
  - /action/bank DELETE
  - /action/bank/update-title PATCH
  - /action/bank/add-question PATCH
  - /action/bank/remove-question PATCH
*/

describe('Users', function() {
  // Clear User database
  QuestionBank.destroy({ where: {} });
  Feedback.destroy({ where: {} });
  User.destroy({ where: {} });

  // Before each test, run this
  beforeEach(function(done) {
    console.log('---Before Each Test Run---');
    const userData = {
      username: 'sonaixu',
      password: '123456789',
      email: 'soniaxu96@gmail.com'
    };

    // Creates a session user and then logs them in using chaiHttp's 'agent' feature
    User.create(userData, {
      include: [{ model: QuestionBank, as: 'QuestionBanks' }, { model: Feedback, as: 'Feedbacks' }]
    }).then(user => {
      agent.post('/auth/login').send({ username: user.username, password: user.password }).end((err, res) => {
        if (err) throw err;

        // Create 3 feedbacks for session user
        const feedbackData = {
          UserId: user.id,
          path: '../test.flac',
          question: 'How well do you work in a team?',
          anger: 0.33,
          fear: 0.05,
          joy: 0.88,
          sadness: 0.99,
          analytical: 0.05,
          tentative: 0.12,
          id: 1
        };

        Feedback.create(feedbackData).catch(err => console.log(err));

        // Create 3 question banks for session user
        const bankData = {
          UserId: user.id,
          title: 'Team Questions',
          questions: ['Are you a leader?', 'Are you a follower?', 'How well do you work in a team?'],
          id: 1
        };

        const bankData2 = {
          UserId: user.id,
          title: 'Technical Questions',
          questions: ['Which project on your resume are you most proud of?'],
          id: 2
        };

        const bankData3 = {
          UserId: user.id,
          title: 'Behavioral Questions',
          questions: ['Tell me about yourself.', 'Why do you want to work for us?'],
          id: 3
        };

        QuestionBank.create(bankData).catch(err => console.log(err));
        QuestionBank.create(bankData2).catch(err => console.log(err));
        QuestionBank.create(bankData3).catch(err => console.log(err));

        done();
      });
    });
  });

  // After each test, clear the User database
  afterEach(function(done) {
    console.log('---After Each Test Run---');
    QuestionBank.destroy({ where: {} });
    Feedback.destroy({ where: {} });
    User.destroy({ where: {} });
    done();
  });
});
