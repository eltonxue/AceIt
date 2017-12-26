$('#register-button').on('click', function() {
  alert('register button pressed');
  axios
    .post('/auth/register', {
      username: $('#username').val(),
      email: $('#username').val(),
      password: $('#password').val()
    })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(err) {
      console.log(err);
    });
});

const checkValidInput = () => {
  // Check if username exists
  // Check if email exists
  // Check if passwords are a match
};
