var WIU = WIU || {};

WIU.header = (function () {

  var
  // working with all the functions
    init = function () {
      if ($('.site-header.nav').length) {
        $('#signInBtn').on('click', function () {
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
    // email validation (email format)
    structureEmail = function (email) {
      var emailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailFormat.test(email);
    },
    // validating email to make sure that email is a valid email address
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
    // checks to make sure the user enters in a password into the input line
    emptyPassword = function () {
      var pw = $('.password').val();
      if (pw === "") {
        return true;
      }
      else {
        return false;
      }
    },
    // putting the existing user into an object
    existingUser = function () {
      var user = {
        email: $('.email').val(),
        password: $('.password').val()
      };
      console.log(user);
    };

  return {
    init: init
  }
})();

$(function () {
  WIU.header.init();
});
