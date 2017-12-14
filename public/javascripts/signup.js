var WIU = WIU || {};

WIU.signup = (function () {

  var
    // working with all the functions
    init = function () {
      if ($('.signup-page').length) {
        $('#signUpBtn').on('click', function () {
          if (!validate()) {
            $('#result').text("Sorry! This email is not a valid email address");
          }
          else if (emptyPassword()) {
            $('#result').text("Please enter in a password.");
          }
          else if (!confirmPW()) {
            $('#result').text("Passwords don't match. Please try again.");
          }
          else {
            addUser();
          }
        });
      }
    },
    // email validation (email format)
    validateEmail = function (email) {
      var emailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailFormat.test(email);
    },
    // validating email to make sure that email is a valid email address
    validate = function () {
      $('#result').text('');
      var email = $('#email').val();
      if (validateEmail(email)) {
        return true;
      } else {
        $('#result').text(email + " is not valid");
        $('#result').css('color', 'red');
        return false;
      }
    },
    // confirming both passwords entered are the same
    confirmPW = function () {
      var pw = $('#password').val();
      var pwConfirm = $('#confirm-pw').val();
      if (pw === pwConfirm) {
        return true;
      } else {
        return false
      }
    },
    // checks to make sure the user enters in a password into the input line
    emptyPassword = function () {
      var pw = $('#password').val();
      if (pw === "") {
        return true;
      }
      else {
        return false;
      }
    }
  // adding user information into the new user object
  addUser = function () {
    var newUser = {
      username: $('#username').val().trim(),
      email: $('#email').val().trim(),
      password: $('#password').val().trim()
    };
    console.log(newUser);
  };

  return {
    init: init
  }
})();

$(function () {
  WIU.signup.init();
});





