var WIU = WIU || {};

WIU.animate = (function() {

  var 
  breakWords = function($wordsDiv, callback) {
    var words = $wordsDiv.attr('data-id');

    if (typeof words === 'string' && words.trim() !== '') {
      var wordsArr = words.trim().split(' ');

      $.each(wordsArr, function(index, word) {
        var $newDiv = $('<div class="wiu-animate">' + word + '</div>');
        $wordsDiv.append($newDiv);
      });

      callback($wordsDiv);
    }
  },
  getNextStagger = function(stagger, lastIndex) {
    return stagger * lastIndex;
  },
  apply = function($div, effect) {
    if (effect !== '') {
      $div.addClass('animated ' + effect);

      $div.off('oanimationend animationend webkitAnimationEnd').on('oanimationend animationend webkitAnimationEnd', function() {
        $div.removeClass('animated ' + effect);
      })
    }
  },
  bounceWords = function($wordsDiv, stagger, callback) {
    stagger = typeof stagger !== 'undefined' ? stagger : 0;    

    breakWords($wordsDiv, function() {
      var $toBounce = $wordsDiv.find('.wiu-animate');

      $toBounce.each(function(index) {
        var $this = $(this); 
        setTimeout(function() {
          apply($this, 'bounce');
        }, stagger * index);
      });

      if (typeof callback === 'function') {
        var nextStagger = getNextStagger(stagger, $toBounce.length);
        setTimeout(function() {
          callback();
        }, nextStagger);
      }
      
    });
  };

  return {
    bounceWords : bounceWords,
    apply : apply
  }
})();
var WIU = WIU || {};

WIU.createEvent = (function() {

  var 
  isSimilar = function(original, formatted) {
    var ogArr = original.split(' '),
        total = ogArr.length,
        matched = 0;

    $.each(ogArr, function(index, word) {
      if (formatted.indexOf(word) !== -1) {
        matched++;
      }
    });
    console.log('matched ' + matched + ' out of ' + total);

    return (matched/total).toFixed(2);
  },
  geocodeAddress = function(location, callback) {
    var apiKey = 'AIzaSyCdPObqQECeLB2K0xW96U8Rhzd3sFS9d4k',
        address = location.split(' ').join('+'),
        apiURL = 'https://maps.googleapis.com/maps/api/geocode/json?components=country:US&',
        requestURL = apiURL + 'address=' + address + '&key=' + apiKey,
        addressObj = {};

    //console.log('restURL: ', requestURL);

    $.ajax({
      method: "GET",
      url: requestURL
    })
    .done(function(data) {
      //console.log('what google said:', data);
      if (data.status === 'OK' && data.results.length == 1) {
        var lat = data.results[0].geometry.location.lat,
            lng = data.results[0].geometry.location.lng,
            placeID = data.results[0].place_id,
            formattedAddy = data.results[0].formatted_address;

        //console.log('hey', lat, lng, placeID, formattedAddy);

        addressObj.latlng     = lat +', ' + lng;
        addressObj.placeID    = placeID;
        addressObj.formatted  = formattedAddy;
      }
      else {
        console.log('problem geocoding', data);
      }

      if (typeof callback == 'function') {
        callback(addressObj);
      }

    });
  },
  showSuggestion = function(addressObj) {
    var $suggestDiv = $('.address-suggest-div'),
        $addyDiv = $('.address-suggest', '.address-suggest-div'),
        $suggestCB = $('.suggest-cb', '.address-suggest-div');

    // clear check box and hide suggestion
    $suggestCB.prop('checked', false);
    $suggestDiv.addClass('hidden');

    if (typeof addressObj.formatted !== 'undefined' && addressObj.formatted != '') {
      $addyDiv.html(addressObj.formatted);
      $suggestDiv.removeClass('hidden');
    }
  },
  initAddressComplete = function() {
    var $location = $('.location', '.create-events-page');

    $location.on('blur', function() {

      var address = $location.val();

      if (typeof address !== 'undefined' && address.trim() != '' && address.trim().length > 1) {
        geocodeAddress(address.trim(), function(obj) {
          fillHiddenFields(obj);
          showSuggestion(obj);
        });
      }
      
    })
  },
  initDatepicker = function() {
    $('#event-date').datepicker();
  },
  verifyData = function(obj) {
    return !(typeof(obj.name) === 'undefined' || obj.name === null || obj.name.trim() === '');
  },
  fillHiddenFields = function(obj){ 
    var page = '.create-events-page',
        $placeID = $('.place-id', page),
        $latlong = $('.latlong', page),
        $formatted = $('.formatted-addy', page);

    if (typeof obj.placeID !== 'undefined' && typeof obj.latlng !== 'undefined' &&
        typeof obj.formatted !== 'undefined') {
      $placeID.val(obj.placeID);
      $latlong.val(obj.latlng);
      $formatted.val(obj.formatted);  
    }
    else {
      $placeID.val('');
      $latlong.val('');
      $formatted.val('');
    }
  },
  getData = function() {
    var page = '.create-events-page',
        eventName = $('.event-name', page).val(),
        eventDate = $('.event-date', page).val(),
        eventTime = $('.start-time', page).val(),
        location  = $('.location', page).val(),
        eventDesc = $('.event-desc', page).val(),
        invites   = $('.invite', page).val(),
        isPrivate = $('.is-private-cb', page).is(':checked'),
        suggestCB = $('.suggest-cb', page).is(':checked'),
        locationObj = {
          name : location
        };

    if (suggestCB) {
      locationObj.placeID = $('.place-id', page).val();
      locationObj.latlng  = $('.latlong', page).val();
      locationObj.formatted = $('.formatted-addy', page).val();
    }

    return {
      name      : eventName,
      date      : eventDate,
      time      : eventTime,
      location  : locationObj,
      desc      : eventDesc,
      private   : isPrivate,
      invites   : invites
    };
  },
  initCreateBtn = function() {
    var $createBtn = $('.create-btn');

    $createBtn.on('click', function(e) {
      var eventObj = getData();

      if (verifyData(eventObj)) {
        console.log('event obj:', eventObj);
      }
      else {
        // throw warning!
        $('.error-name').removeClass('hidden');

        return false;
      }

    });
  },
  init = function() {
    if ($('.create-events-page').length) {
      initDatepicker();
      initCreateBtn();
      initAddressComplete();
    }
  };

  return {
    init : init
  }
})();

$(function() {
  WIU.createEvent.init();
});
var WIU = WIU || {};

WIU.findEvents = (function() {

  var 
  initDatepicker = function() {
    $('#start-date').datepicker();
  },
  hideAdvOptions = function(speed, callback) {
    var $advFilters = $('.advance-filters');

    speed = speed || 'fast';
    $advFilters.hide(speed, 'linear');
    $advFilters.addClass('hide');

    if (typeof callback === 'function') {
      callback();  
    }
  },
  showAdvOptions = function(speed) {
    var $advFilters = $('.advance-filters');

    speed = speed || 'fast';
    $advFilters.show(speed, 'linear');
    $advFilters.removeClass('hide');
  },
  initAdvOptions = function() {
    var $advOptsLink = $('.toggle-advance-options');

    $advOptsLink.on('click', function(e) {
      e.preventDefault();

      var $advFilters = $('.advance-filters');

      if ($advFilters.hasClass('hide')) {
        $('.advance-option').html('hide advance options');
        showAdvOptions(300);
      }
      else {
        $('.advance-option').html('advance options');
        hideAdvOptions(300);
      }
    });
  },
  init = function() {
    if ($('.find-events-page').length) {
      initDatepicker(); 
      initAdvOptions();
    }
  };

  return {
    init : init
  }
})();

$(function() {
  WIU.findEvents.init();
});
var WIU = WIU || {};

WIU.header = (function() {

  var 
  init = function() {
    if ($('.site-header.nav').length) {
      
    }
  };

  return {
    init : init
  }
})();

$(function() {
  WIU.header.init();
});

function 
var WIU = WIU || {};

WIU.landing = (function() {

  var 
  initFindBtn = function() {
    var $findBtn = $('.find-btn');
    $findBtn.on('click', function() {
      window.location = '/find-events';  
    });
  },
  initCreateBtn = function() {
    var $findBtn = $('.create-btn');
    $findBtn.on('click', function() {
      window.location = '/create-event'; 
    });
  },
  startAnimate = function() {
    // animate title
    WIU.animate.bounceWords($('.main-title'), 400, function() {
      WIU.animate.apply($('.site-logo'), 'rubberBand');
    });
  },
  init = function() {
    if ($('.landing-page').length) {
      startAnimate();
      initFindBtn();
      initCreateBtn();
    }
  };

  return {
    init : init
  }
})();

$(function() {
  WIU.landing.init();
});
var WIU = WIU || {};

WIU.profile = (function() {

  var 
  bindAvatarSelect = function() {
    var $avatarBtn = $('.avatar', '.avatar-section');
        
    $avatarBtn.on('click', function() {
      var $currAvatar = $('.current-avatar'),
          currentAID = $currAvatar.attr('data-id'),
          avatarID = $(this).attr('data-id'); 

      if (currentAID !== avatarID) {
        $currAvatar.attr('data-id', avatarID);
        $currAvatar.addClass('avatar-' + avatarID);
        $currAvatar.removeClass('avatar-' + currentAID);

        WIU.animate.apply($currAvatar, 'rubberBand'); 
      }
    });
  },
  confirmPassword = function(oldPW, newPW) {
    return (oldPW === newPW);
  },
  hasOldPassword = function(data) {
    if (typeof data.newPW !== 'undefined' && data.newPW !== null && data.newPW.trim() !== '') {
      if (typeof data.oldPW !== 'undefined' && data.oldPW.trim() !== '') {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  },
  verifyData = function(data) {
    var allGood = true;

    // hide all existing error messages
    $('.error').addClass('hidden');

    if (!confirmPassword(data.newPW, data.confirmPW)) {
      $('.error-confirm').removeClass('hidden');
      allGood = false;
    }

    if (!hasOldPassword(data)) {
      $('.error-old-pw').removeClass('hidden'); 
      allGood = false;
    }
    return allGood;
  },
  getUserData = function() {
    var editDiv = '.edit-profile',
        username = $('.username', editDiv).val(),
        oldPW = $('.old-pw', editDiv).val(),
        newPW = $('.new-pw', editDiv).val(),
        confirmPW = $('.confirm-pw', editDiv).val();

    return {
      username  : username,
      oldPW     : oldPW,
      newPW     : newPW,
      confirmPW : confirmPW
    };
  },
  bindUpdateBtn = function() {
    var $updateBtn = $('.update-btn');

    $updateBtn.on('click', function() {
      var data = getUserData();

      if (verifyData(data)) {
        console.log('user data is good: ', data);
      }
      else {
        console.log('problem with your input!')
      }
    });
  },
  init = function() {
    if ($('.edit-profile', '.profile-page').length) {
      bindAvatarSelect();
      bindUpdateBtn();
    }
  };

  return {
    init : init
  }
})();

$(function() {
  WIU.profile.init();
});
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
    emptyPassword = function() {
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





