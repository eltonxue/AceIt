axios
  .post('/api/tone-analyzer', {
    username: '8be17060-7d16-4dde-b8db-2f789916806c',
    password: 'pxQuQ0lbWszM',
    text:
      'Hey guys, my name is Elton. I am a third year student at UC Irvine studying computer science. I am really smart!'
  })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });

$('#learn-more').click(function(event) {
  var bottom = $(document).height() - $(window).height();
  $('html, body').animate({ scrollTop: bottom }, 1000);
});
