var express = require('express');
var router = express.Router();

// Logs the user in as a session user
router.post('/login', function(req, res, next) {
  res.send('login');
});

module.exports = router;
