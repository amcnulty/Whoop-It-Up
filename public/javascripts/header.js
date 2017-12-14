var WIU = WIU || {};

WIU.header = (function () {

  var
    init = function () {
      if ($('.site-header.nav').length) {
        $('#signUpBtn').on('click', function () {
          if (!validate()) {
            $('#result').text("Sorry! This email is not a valid email address");
          }
          else if (emptyPassword()) {
            $('#result').text("Please enter in a password.");
          }
          else {
            existingUser();
          }
        });
      }
    },
    structureEmail = function (email) {
      var emailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailFormat.test(email);
    },
    validate = function () {
      $('#result').text('');
      var email = $('.email').val();
      if (structureEmail(email)) {
        return true;
      } else {
        $('#result').text(email + " is not valid");
        $('#result').css('color', 'red');
        return false;
      }
    },
    emptyPassword = function () {
      var pw = $('.password').val();
      if (pw === "") {
        return true;
      }
      else {
        return false;
      }
    },
    existingUser = function () {
      var user = {
        email: $('.email').val(),
        password: $('.password').val()
      };
      console.log(user);
    }

  return {
    init: init
  }
})();

$(function () {
  WIU.header.init();
});


