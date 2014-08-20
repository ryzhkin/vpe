(function () {
  var GV = {};
  var init = function () {
    GV.footer = $('footer').offset().top;
    $('.left-side, .right-side').css({ 'height': GV.footer });
  };
  $(document).ready(function () {
    // init();
    // window.onresize = init;
    $('form').validate();
  });
}());