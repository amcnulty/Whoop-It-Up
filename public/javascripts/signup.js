var WIU = WIU || {};

WIU.signup = (function() {

  var 
  init = function() {
    if ($('.create-events-page').length) {
      
    }
  };

  return {
    init : init
  }
})();

$(function() {
  WIU.signup.init();
});



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

$('#signUpBtn').on('click', validate);