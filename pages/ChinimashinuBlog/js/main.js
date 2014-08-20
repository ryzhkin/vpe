(function ($) {
  $(function () {
    var GV = {};
    GV.artIndex = 0;
    var slider = $('.slider>ul').bxSlider({
        pager: false,
        controls: false
      });
    var blink = function (state) {
      var obj = $('a.show-more');
      if (!GV.blink) {
        GV.blink = setInterval(function () {
          obj.hasClass('blink') === true ? obj.removeClass('blink') : obj.addClass('blink');
        }, 1000);
      } else {
        obj.removeClass('blink');
        clearInterval(GV.blink);
        GV.blink = false;
      }
      return GV.blink;
    };
    $(document).on('click', '.control a', function (e) {
      e.preventDefault();
      if ($(this).hasClass('prev')) {
        slider.goToPrevSlide();
      } else {
        slider.goToNextSlide();
      }
    }).on('click', 'nav .subscribe a', function (e) {
      e.preventDefault();
      var parent = $(this).parent();
      if (parent.hasClass('active')) {
        parent.removeClass('active');
        $('#main-menu').removeClass('open').addClass('hide');
        $('#content').removeClass('open');
      } else {
        parent.addClass('active');
        $('#content').addClass('open');
        $('#main-menu').removeClass('hide').addClass('open');
      }
    }).on('click', 'a.show-more', function (e) {
      e.preventDefault();
      var handler = {};
      handler.current = {};
      handler.type1 = {
        url: 'type1.json',
        data: {
          action: 'getarts',
          type: 'type1',
          from: GV.artIndex
        },
        success: function (data) {
          var arts = '';
          for (var art in data.data) {
            arts += '<h2><a href="' + data.data[art].link + '">' + data.data[art].head + '</a></h2>';
            arts += '<div class="date">' + data.data[art].date + '</div>';
            arts += '<img src="' + data.data[art].img + '">';
            arts += '<p>' + data.data[art].content + '</p><div class="more"><a href="#">\u0427\u0438\u0442\u0430\u0442\u044c \u0434\u0430\u043b\u0435\u0435</a></div>';
            $('<article>' + arts + '</article>').insertAfter('article:last');
            arts = '';
            GV.artIndex += 1;
          }
        }
      };
      handler.type2 = {
        url: 'type2.json',
        data: {
          action: 'getarts',
          type: 'type2',
          from: GV.artIndex
        },
        success: function (data) {
          var arts = '';
          for (var art in data.data) {
            arts += '<img src="' + data.data[art].img + '">';
            arts += '<div>';
            arts += '<h3><a href="' + data.data[art].link + '">' + data.data[art].head + '</a></h3>';
            arts += '<p>' + data.data[art].content + '</p><div class="more"><a href="#">\u0427\u0438\u0442\u0430\u0442\u044c \u0434\u0430\u043b\u0435\u0435</a></div>';
            arts += '</div>';
            $('.arts:last').append('<li>' + arts + '</li>');
            arts = '';
            GV.artIndex += 1;
          }
        }
      };
      if ($(this).hasClass('type1')) {
        handler.current = handler.type1;
      } else if ($(this).hasClass('type2')) {
        handler.current = handler.type2;
      }
      $.ajax({
        type: 'GET',
        url: handler.current.url,
        data: handler.current.data,
        dataType: 'json',
        beforeSend: blink,
        complete: function () {
          setTimeout(function () {
            blink();
          }, 3000);
        },
        success: function (data) {
          if (data.status = 'OK') {
            setTimeout(function () {
              handler.current.success(data);
            }, 3000);
          }
        },
        error: function (xhr, status) {
          console.log(status);
        }
      });
    }).on('click', 'input[type=submit].btn', function (e) {
      e.preventDefault();
      var mail = $(this).closest('form').find('input[type=text]');
      if (mail.val().match(/[0-9a-z_]+@[0-9a-z_^\.]+\.[a-z]{2,3}/) == null) {
        mail.addClass('invalid');
      } else {
        mail.removeClass('invalid');
        alert('OK');
      }
    });
    GV.nav = $('#main-menu').offset().top;
    var menuLock = function () {
        return function () {
          var top = $(window).scrollTop();
          if (top >= GV.nav) {
            $('#main-menu').addClass('fixed');
          } else {
            $('#main-menu').removeClass('fixed');
          }
        };
      }();
    // $(window).scroll(menuLock);
    $(document).bind('touchmove', menuLock);
    window.onscroll = menuLock;
  });
}(jQuery));