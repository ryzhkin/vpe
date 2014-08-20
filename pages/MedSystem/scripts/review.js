(function () {
  var GV = {
      wh: $(window).height(),
      ww: $(window).width(),
      img: []
    };
  var myScroll = function () {
    var top = $(this).scrollTop();
    var slider = $('.bg .wrapper');
    var doctor = $('#doctor');
    var user = $('#user');
    var coach = $('#coach');
    if (top <= GV.wh - 140) {
      slider.css({ 'background-position': 'center ' + Math.round(-130 - top / 2) + 'px' });
      $('#registration .middle').myTransform(top / 4);
    }
    doctor.myParalax(top);
    if (top >= GV.wh * 2 - 30 - 260) {
      $('#coach').addClass('fixed');
    } else {
      $('#coach').removeClass('fixed');
    }
  };
  $(document).ready(function () {
    init();
    window.onresize = init;
  }).on('click', '.me a', function (event) {
    event.preventDefault();
    var target = $($(this).attr('href')).offset().top;
    $('html, body').animate({ scrollTop: target - 130 }, 500);
  }).on('click', 'a.scroll', function (event) {
    event.preventDefault();
    var $next = $(this).closest('section').next();
    var delta = $next.offset().top;
    if ($next.attr('id') == 'coach') {
      delta += 40;
    }
    var top = $(window).scrollTop();
    $('html, body').animate({ scrollTop: delta - GV.wh + 10 }, 500);
  });
  // .bind('touchmove', myScroll);
  $.prototype.myParalax = function (top) {
    var $obj = $(this);
    var $next = $(this).next();
    var wh = $(window).height();
    var nextToTop = $next.offset().top;
    if (top > GV.wh - 140) {
      if (!$obj.hasClass('fixed')) {
        GV.objOffset = $obj.offset().top;
        $obj.addClass('fixed');
        $next.css({ 'margin-top': GV.wh - 140 });
      }
      // offset = -(top-GV.wh-140)/2-10; //используется при топе
      offset = -(top - GV.wh + 140) / 2;
      $obj.myTransform(offset);
    } else {
      $obj.myTransform(0).removeClass('fixed');
      $next.css({ 'margin-top': 0 });
    }
  };
  var init = function () {
    GV.wh = $(window).height();
    GV.ww = $(window).width();
    $('section:not(#registration, #coach)').css({
      'height': GV.wh - 10 - 130,
      'line-height': GV.wh - 130 - 10 + 'px'
    });
    $('#registration').css({ 'height': GV.wh - 130 - 10 });
    $('#coach').css({
      'height': GV.wh - 130,
      'line-height': GV.wh - 180 + 'px'
    });
    $('section .image').each(function () {
      $(this).css({ 'height': $(this).width() });
    });
    $('#user').css({ 'margin-bottom': GV.wh - 180 + 'px' });
    var img = ['images/sl-item1.jpg'];
    var $img = $('img');
    $img.each(function (i) {
      img.push($(this).attr('data-src'));
    });
    $.preloadImages(img, function () {
      $img.each(function () {
        $(this).attr('src', $(this).attr('data-src'));
      });
      $('.bg .wrapper').css({ 'opacity': 1 });
      $('.me').addClass('open');
      window.onscroll = myScroll;
      document.addEventListener('touchmove', myScroll);
    });
  };
  $.prototype.myResize = function () {
    var img = new Image();
    img.src = $(this).attr('src');
    var h = img.height;
    var w = img.width;
    var al = arguments.length;
    var winWidth = al === 0 ? $(window).width() : arguments[0];
    var winHeight = al <= 1 ? $(window).height() : arguments[1];
    r1 = winWidth / w;
    r2 = winHeight / r1;
    if (r2 < h) {
      newW = winWidth;
      newH = h * r1;
    } else {
      newH = winHeight;
      newW = w * (winHeight / h);
    }
    var left = Math.round((winWidth - newW) / 2);
    var top = Math.round((winHeight - newH) / 2);
    $(this).css({
      'width': newW,
      'height': Math.round(newH),
      'top': top,
      'left': left
    });
  };
  $.preloadImages = function () {
    if (typeof arguments[arguments.length - 1] == 'function') {
      var callback = arguments[arguments.length - 1];
    } else {
      var callback = false;
    }
    if (typeof arguments[0] == 'object') {
      var images = arguments[0];
      var n = images.length;
    } else {
      var images = arguments;
      var n = images.length - 1;
    }
    var not_loaded = n;
    for (var i = 0; i < n; i++) {
      myImge = $(new Image()).attr('src', images[i]);
      if (myImge.height() > 0 && typeof callback == 'function') {
        callback();
      } else {
        $(myImge).load(function () {
          if (--not_loaded < 1) {
            callback();
          }
        });
      }
    }
  };
  $.prototype.myTransform = function (value) {
    $(this).css({ 'transform': 'translate3d(0px, ' + value + 'px, 0px)' });
    // $(this).css({'top':Math.round(value)+'px'});
    return this;
  };
}());