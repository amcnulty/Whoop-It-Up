var WIU = WIU || {};

WIU.signup = (function () {

  var
    // working with all the functions
    init = function () {
      if ($('.signup-page').length) {
        $('#signUpBtn').on('click', function () {
          var allGood = true;
          if (!validateUsername()) {
            $('#usernameResult').text("Please enter a valid username.");
            allGood = false;
          }
          if (!validate()) {
            $('#emailResult').text("Sorry! This email is not a valid email address.");
            allGood = false;
          }
          if (emptyPassword()) {
            $('#pwResult').text("Please enter in a password.");
            allGood = false;
          }
          if (!confirmPW()) {
            $('#result').text("Passwords don't match. Please try again.");
            allGood = false;
          }
          if (allGood) {
            addUser();
          }
        });
      }
    },
    // username validation
    validateUsername = function () {
      $('#usernameResult').text('');
      var username = $('#username').val().trim();
      if (username === "") {
        return false;
      } else {
        return true;
      }
    },
    // email validation (email format)
    validateEmail = function (email) {
      var emailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailFormat.test(email);

    },
    // validating email to make sure that email is a valid email address
    validate = function () {
      $('#emailResult').text('');
      var email = $('#email').val();
      if (validateEmail(email)) {
        return true;
      } else {
        $('#emailResult').text(email + " is not valid");
        $('#emailResult').css('color', 'red');
        return false;
      }
    },
    // confirming both passwords entered are the same
    confirmPW = function () {
      $('#result').text('');
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
      $('#pwResult').text('');
      var pw = $('#password').val();
      if (pw === "") {
        return true;
      }
      else {
        return false;
      }
    },
    signInUser = function(userObj) {
      $.ajax({
        method: "POST",
        url: "./profile/signin",
        data: {
          email : userObj.email,
          password : userObj.password
        }
      })
      .done(function(res) {
        // window.location = './profile/getuser/' + res.id;
        WIU.animate.leavePage('./profile/getuser/' + res.id);
      });
    },
    // adding user information into the new user object
    addUser = function () {
      var newUser = {
        username: $('#username').val().trim(),
        email: $('#email').val().trim(),
        password: $('#password').val().trim(),
        avatar: Math.floor(Math.random() * 4)
      };
      $.ajax({
        method: 'POST',
        url: './profile/signup',
        data: newUser
      })
      .done(function(res, status, xhr) {
        signInUser(newUser);
      })
      .fail(function(res, status, xhr) {
        console.log('haha it failed!', res, status, xhr);
      })
    };

  return {
    init: init
  }
})();

$(function () {
  WIU.signup.init();
});





