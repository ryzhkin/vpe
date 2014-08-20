(function () {
  var menuHover = function (event) {
    event.preventDefault();
    var $faider = $(this).closest('.wrapper').find('.faider');
    var w = $(this).width() - 20;
    var delta = $(this).closest('ul').offset().left;
    var l = $(this).offset().left;
    $faider.css({
      'width': w,
      'opacity': 1,
      'transform': 'translate3d(' + (-delta + l) + 'px, 0, 0)'
    });
  };
  var dropDown = function (event) {
    event.preventDefault();
    var obj = $(this);
    var parentObj = obj.closest('.drop-down');
    if ($(this).prop('tagName') == 'INPUT') {
      parentObj.toggleClass('open');
    } else {
      parentObj.find('input').val(obj.text());
      parentObj.toggleClass('open');
    }
  };
  $(document).on('click', 'a.load-file', function (event) {
    event.preventDefault();
    $(this).next().click();
  }).on('click', '.drop-down input, .drop-down li', dropDown).on('mouseenter', '.menu li', menuHover).on('mouseleave', '.menu li', function () {
    $(this).closest('.wrapper').find('.faider').css({ 'opacity': 0 });
  });
}());