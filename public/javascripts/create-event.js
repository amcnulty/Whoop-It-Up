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

    return (matched/total).toFixed(2);
  },
  geocodeAddress = function(location, callback) {
    var apiKey = 'AIzaSyCdPObqQECeLB2K0xW96U8Rhzd3sFS9d4k',
        address = location.split(' ').join('+'),
        apiURL = 'https://maps.googleapis.com/maps/api/geocode/json?components=country:US&',
        requestURL = apiURL + 'address=' + address + '&key=' + apiKey,
        addressObj = {};

    $.ajax({
      method: "GET",
      url: requestURL
    })
    .done(function(data) {
      if (data.status === 'OK' && data.results.length == 1) {
        var lat = data.results[0].geometry.location.lat,
            lng = data.results[0].geometry.location.lng,
            placeID = data.results[0].place_id,
            formattedAddy = data.results[0].formatted_address;

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
  getHostInfo = function() {
    var $hostName = $('.host-name'),
        $hostID = $('.host-id'),
        host = {
          id    : 1,
          name  : 'Gorilla Gang'
        };

    if ($hostName.length && $hostID.length) {
      host = {
        id    : $hostID.val(),
        name  : $hostName.val()
      };
    }
    return host;
  },
  getEventCategory = function() {
    var categories = $('.event-category'),
        checkedCategories = [];

    for (var i = 0; i < categories.length; i++) {
      if ($(categories[i]).is(':checked')) checkedCategories.push(
        parseInt(categories[i].value)
      );
    }

    if (checkedCategories.length == 0) {
      checkedCategories.push(7);
    }

    return checkedCategories;
  },
  getData = function() {
    var page = '.create-events-page',
        eventName = $('.event-name', page).val(),
        eventDate = $('.event-date', page).val(),
        eventTime = $('.start-time', page).val(),
        location  = $('.location', page).val(),
        eventDesc = $('.event-desc', page).val(),
        isPrivate = $('.is-private-cb', page).is(':checked'),
        hostObj = getHostInfo(),
        checkedCategories = getEventCategory();

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
      description : eventDesc,
      isPrivate   : isPrivate,
      host      : hostObj.name,
      hostId    : hostObj.id,
      geoData   : locationObj,
      categories: JSON.stringify(checkedCategories)
    };
  },
  initCreateBtn = function() {
    var $createBtn = $('.create-btn');

    $createBtn.on('click', function(e) {
      var eventObj = getData();

      if (verifyData(eventObj)) {
        $.ajax({
          method: 'POST',
          url: './event/createevent',
          data: eventObj
        })
        .done(function(res) {
          var eventID = parseInt(res.id);
          WIU.animate.leavePage('/event/' + eventID);
        })
        .fail(function(res, status, xhr) {
          console.log('An error occured', res);
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