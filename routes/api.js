var express = require('express');
var axios = require('axios');
var router = express.Router();

// *** Request data from IBM Tone Analyzer API ***
router.post('/tone-analyzer', function(req, res, next) {
  const data = req.body;
  const username = data.username;
  const password = data.password;

  let text = data.text;
  // text = text.replace(/ /g, '%');

  const url = `https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21&text=${text}`;

  // Retrieves data from API
  axios
    .get(url, {
      auth: {
        username,
        password
      }
    })
    .then(response => {
      res.json(response.data);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
