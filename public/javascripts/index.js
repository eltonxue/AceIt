$('#learn-more').click(function(event) {
  var bottom = $(document).height() - $(window).height();
  $('html, body').animate({ scrollTop: bottom }, 1000);
});
