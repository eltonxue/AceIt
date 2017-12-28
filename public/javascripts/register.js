$('#register').submit(function(e) {
  // Clear error messages
  e.preventDefault();
  let errors = $('.error');
  for (let i = 0; i < errors.length; ++i) {
    errors[i].remove();
  }

  checkValidInputs();

  // Registration
  if ($('.error').length === 0) {
    axios
      .post('/auth/register', {
        username: $('#username').val(),
        email: $('#email').val(),
        password: $('#password').val()
      })
      .then(function(response) {
        const { data } = response;
        if (!data.error) {
          axios
            .post('/auth/login', {
              username: data.username,
              password: data.password
            })
            .then(function(response) {
              window.location.href = response.data.redirect;
            });
        } else {
          // Add error messages
          let errorMessage = $('<label>', { class: 'error' });
          errorMessage.text(data.error);
          if (data.type === 'username') {
            $('#username').after(errorMessage);
          } else {
            $('#email').after(errorMessage);
          }
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});

const checkValidInputs = () => {
  // Check if empty inputs
  const inputIDs = ['password', 'email', 'username'];

  let errorMessage = $('<label>', { class: 'error' });

  inputIDs.forEach(function(id) {
    let input = $(`#${id}`);
    if (input.val() === '') {
      errorMessage.text('Field required');
      input.after(errorMessage);
    }
  });
  // Check if passwords > 5 are a match
  const password = $('#password').val();
  const confirmPassword = $('#confirm-password').val();
  if (password !== confirmPassword) {
    errorMessage.text('Passwords do not match');
    $('#confirm-password').after(errorMessage);
  }

  if (password <= 6 || confirmPassword.length <= 6) {
    errorMessage.text('Passwords must be greater than 6 characters');
    $('#confirm-password').after(errorMessage);
  }

  // Check if password is greater than >
};
