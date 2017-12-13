var WIU = WIU || {};

WIU.signup = (function () {

  var
    init = function () {
      if ($('.create-events-page').length) {

      }
    };

  return {
    init: init
  }
})();

$(function () {
  WIU.signup.init();
});


// email validation
function validateEmail(email) {
  var emailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailFormat.test(email);
}
function validate() {
  $('#result').text('');
  var email = $('#email').val();
  if (validateEmail(email)) {
    $('#reult').text(email + " is valid");
    $('#result').css('color', "green");
  } else {
    $('#result').text(email + " is not valid");
    $('#result').css('color', 'red');
  }
  return false;
}

// confirming both passwords entered are the same
// function confirmPW() {
//   var pw = $('#password').val();
//   var pwConfirm = $('#confirm-pw').val();

//   if (pw === pwConfirm) {
//     pw.push(/*user information database/array */);
//   } else {
//     alert("Passwords don't match.  Please try again.");
//   }
// }

// $('#signUpBtn').on('click', validate);
// $('#signUpBtn').on('click', confirmPW);


function addUser() {
  $('#signUpBtn').on('click', function () {
    var newUser = {};
    $('input').each(function () {
      var newUser = {
        username: $('#username').val().trim(),
        email: $('#email').val().trim(),
        password: $('#password').val().trim()
      };
      console.log(newUser);
    });
  });
};





