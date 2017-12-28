$('#login').submit(function(e) {
  e.preventDefault();
  let errors = $('.error');
  for (let i = 0; i < errors.length; ++i) {
    errors[i].remove();
  }
  axios
    .post('/auth/login', {
      username: $('#username').val(),
      password: $('#password').val()
    })
    .then(function(response) {
      const { data } = response;
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        // Add error messages
        let errorMessage = $('<label>', { class: 'error' });
        errorMessage.text(data.error);
        if (data.type === 'username') {
          $('#username').after(errorMessage);
        } else {
          $('#password').after(errorMessage);
        }
      }
    })
    .catch(function(err) {
      console.log(err);
    });
});
