$.prototype.validate = function () {
  var obj = $(this);
  var submitBtn = obj.find('[type=submit]');
  var notValid = obj.find('.required:not(.valid)');
  obj[0].reset();
  obj.find('*[required]').each(function () {
    switch (this.type) {
    case 'checkbox':
      this.addEventListener('change', checkValue, false);
      break;
    case 'email':
      this.addEventListener('blur', checkValue, false);
      this.addEventListener('keyup', checkValue, false);
      break;
    default:
      this.addEventListener('keyup', checkValue, false);
    }
  });
  obj.submit(function (event) {
    event.preventDefault();
    $(this).addClass('validate');
    notValid = obj.find('[required]:not(.valid)');
    if (notValid.length == 0) {
      var output = {};
      obj.find('input, textarea, select').each(function (i) {
        if (!$(this).attr('type') == 'submit') {
          output[$(this).attr('name')] = $(this).val();
        }
      });
      submitBtn.addClass('active');
      $.ajax({
        type: 'POST',
        url: obj.attr('action'),
        data: output,
        success: function (data) {
          if (data.status = 'OK') {
            if (data.redirect !== undefined) {
              window.location = data.redirect.url;
            }
          }
        },
        beforeSend: function () {
        },
        complete: function () {
        }
      });
    } else {
      notValid.addClass('invalid');
      $(obj.find('.required:not(.valid) input')[0]).focus();
    }
  });
};
$.prototype.switchState = function (valid) {
  var oldState = 'valid';
  var newState = 'invalid';
  if (valid) {
    newState = 'valid';
    oldState = 'invalid';
  }
  $(this).removeClass(oldState).addClass(newState);
  return newState;
};
var validateEmail = function (email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
var checkValue = function (event) {
  if ($(this).hasClass('number')) {
    event.preventDefault();
    this.value = this.value.replace(/[a-z]/gi, '');  // this.value = parseInt(this.value)==NaN?'':parseInt(this.value);
  }
  var value = this.value.trim();
  var submitBtn = $(this.form).find('[type=submit][switch]');
  var objRequired = $(this).closest('.required');
  switch (this.id) {
  // case 'prefix': $(this).switchState(value.length == 1);
  //   break;
  default:
    switch (this.type) {
    case 'email':
      objRequired.switchState(validateEmail(value));
      $(this).switchState(validateEmail(value));
      break;
    case 'checkbox':
      objRequired.switchState(this.checked);
      $(this).switchState(this.checked);
      break;
    case 'tel':
      objRequired.switchState(value.length == 12);
      $(this).switchState(value.length == 12);
      break;
    default:
      objRequired.switchState(value.length > 0);
      $(this).switchState(value.length > 0);
    }
  }
  var notValid = $(this.form).find('[required]:not(.valid)');
  if (notValid.length > 0 && submitBtn.length !== 0) {
    submitBtn.attr('disabled', 'disabled');
  } else {
    submitBtn.removeAttr('disabled');
  }
};