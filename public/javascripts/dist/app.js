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
  },
  slideIn = function($divs) {
    var timeline = new TimelineLite({paused: true});

    $divs.each(function(index) {
      var $this = $(this);
      timeline.fromTo($this, 0.3, 
            {opacity: 0, right: -90}, 
            {opacity: 1, right: 0});
    });

    timeline.play();
    
  };

  return {
    bounceWords : bounceWords,
    apply : apply,
    slideIn : slideIn
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
        // invites   = $('.invite', page).val(),
        isPrivate = $('.is-private-cb', page).is(':checked'),
        categories = $('.categoryCheckboxes');
        var checkedCategories = [];
        for (var i = 0; i < categories.length; i++) {
          if ($(categories[i]).is(':checked')) checkedCategories.push(
            parseInt(categories[i].value)
          );
        }

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
      location  : location,
      description      : eventDesc,
      isPrivate   : isPrivate,
      // invites   : invites,
      host:     'Gorilla Gang',
      hostId:   1,
      categories: JSON.stringify(checkedCategories)
    };
  },
  initCreateBtn = function() {
    var $createBtn = $('.create-btn');

    $createBtn.on('click', function(e) {
      var eventObj = getData();

      if (verifyData(eventObj)) {
        // console.log('event obj:', eventObj);
        $.ajax({
          method: 'POST',
          url: './event/createevent',
          data: eventObj
        }).done(function(res) {
          console.log(res);
        });
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

WIU.event = (function () {

  var
    bindFacebookShare = function() {
      var $fbBtn = $('.fb-btn'),
          currentURL = window.location.href,
          shareURL = 'https://www.facebook.com/sharer/sharer.php?u=';

      $fbBtn.attr('href', shareURL + currentURL);
    },
    getLatLong = function() {
      return $('.lat-long').val();
    },
    getPlaceID = function() {
      return $('.place-id').val();
    }, 

    // TODO: q=place_id:......
    readyGoogleMap = function() {
      var key = 'AIzaSyCmiSi2gWmkkVWPwz-lk8N1Htd4Q50-Qz4',
          url = "https://www.google.com/maps/embed/v1/search?key=" + key + '&zoom=18&center=',
          latlong = getLatLong();

      // TODO: remove this when we have backend
      latlong = latlong || '-33.8569,151.2152';

      if (latlong) {
        url += latlong;
        url += '&q=' + 'Fairmont+Empress,Victoria+BC',
        console.log('hey!', url);
        $('.g-map').attr('src', url);
      }
      else {
        // no map
      }

    },
    init = function () {
      if ($('.event-page').length) {
        bindFacebookShare();
        //readyGoogleMap();
      }
    };

  return {
    init: init,
    readyMap : readyGoogleMap
  }
})();

$(window).on('load', function() {
  if ($('.event-page').length) {
    WIU.event.readyMap();
  }
});

$(function () {
  WIU.event.init();
});
var WIU = WIU || {};

WIU.events = (function () {

  var
    
    init = function () {
      if ($('.events-page').length) {
        var $events = $('.event-row');

        WIU.animate.slideIn($events);
      }
    };

  return {
    init: init
  }
})();

$(function () {
  WIU.events.init();
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
  bindFindBtn = function() {
    var $findBtn = $('.find-btn');

    $findBtn.on('click', function() {
      // do ajax POST call, then let server render results page

      // TODO: remove this when backend is ready
      window.location = '/events';
    });
  },
  init = function() {
    if ($('.find-events-page').length) {
      initDatepicker(); 
      initAdvOptions();
      bindFindBtn();
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

WIU.header = (function () {

  var
  // working with all the functions
    init = function () {
      if ($('.site-header.nav').length) {
        $('#signInBtn').on('click', function () {
          if (!validate()) {
            $('#signInResult').text("Sorry! This email is not a valid email address");
          }
          else if (emptyPassword()) {
            $('#signInResult').text("Please enter in a password.");
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
      $('#signInResult').text('');
      var email = $('.email').val();
      if (structureEmail(email)) {
        return true;
      } else {
        $('#signInResult').text(email + " is not valid");
        $('#signInResult').css('color', 'red');
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
      $.ajax({
        method: 'post',
        url: './profile/signin',
        data: user
      }).done(function(res) {
        console.log(res);
      });
    };

  return {
    init: init
  }
})();

$(function () {
  WIU.header.init();
});

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
  isEventTab = function(classes) {
    return classes.indexOf('tab-events') !== -1;
  },
  bindTabShown = function() {
    var $navTabs = $('#profile-tabs');

    $navTabs.on('shown.bs.tab', function(e) {
      
      if (isEventTab(e.target.className)) {
        WIU.animate.slideIn($('.invite-row', '.event-section'));
      }
      else {
        $('.event-row').css('opacity', '0');
      }
    })
  },
  init = function() {
    if ($('.edit-profile', '.profile-page').length) {
      bindTabShown();
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
    }
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
    }).done(function(res) {
      console.log(res);
    });
  };

  return {
    init: init
  }
})();

$(function () {
  WIU.signup.init();
});





