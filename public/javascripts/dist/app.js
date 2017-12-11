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

    console.log('restURL: ', requestURL);

    $.ajax({
      method: "GET",
      url: requestURL
    })
    .done(function(data) {
      console.log('what google said:', data);
      if (data.status === 'OK' && data.results.length == 1) {
        var lat = data.results[0].geometry.location.lat,
            lng = data.results[0].geometry.location.lng,
            placeID = data.results[0].place_id,
            formattedAddy = data.results[0].formatted_address;

        //console.log('hey', lat, lng, placeID, formattedAddy);

        addressObj.latlng     = lat +', ' + lng;
        addressObj.placeID    = placeID;
        addressObj.formatted  = formattedAddy;

        if (typeof callback == 'function') {
          callback(addressObj);
        }
      }
      else {
        console.log('problem geocoding', data);
      }

    });
  },
  showSuggestion = function(addressObj) {
    var $suggestDiv = $('.address-suggest-div'),
        $addyDiv = $('.address-suggest', '.address-suggest-div');

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
  getData = function() {
    var page = '.create-events-page',
        eventName = $('.event-name', page).val(),
        eventDate = $('.event-date', page).val(),
        eventTime = $('.start-time', page).val(),
        location  = $('.location', page).val(),
        eventDesc = $('.event-desc', page).val(),
        invites   = $('.invite', page).val(),
        isPrivate = $('.is-private-cb', page).is(':checked');

    return {
      name      : eventName,
      date      : eventDate,
      time      : eventTime,
      location  : location,
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
        //geocodeAddress(eventObj.location);
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
  init = function() {
    if ($('.landing-page').length) {
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