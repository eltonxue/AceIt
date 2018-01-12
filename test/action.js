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
