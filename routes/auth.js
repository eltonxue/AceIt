var express = require('express');
var router = express.Router();

// Logs the user in as a session user
router.post('/login', function(req, res, next) {
  res.send('login');
});

// Logs the user out of their session
router.get('/logout', function(req, res, next) {
  res.render('index');
});

module.exports = router;
