var WIU = WIU || {};

WIU.event = (function () {

  var
    bindFacebookShare = function() {
      var $fbBtn = $('.fb-btn'),
      currentURL = window.location.href,
      shareURL = 'https://www.facebook.com/sharer/sharer.php?u=';
      
      $fbBtn.attr('href', shareURL + currentURL);
    },
    verifyData = function(obj) {
      return !(typeof(obj.name) === 'undefined' || obj.name === null || obj.name.trim() === '');
    },
    isInvited = false,
    bindUpdateButton = function() {
      $('.update-btn', '.button-row').on('click', function(e) {
        var eventObj = getData();
        if (verifyData(eventObj)) {

          // return false;
          $.ajax({
            method: 'POST',
            url: '/event/updateevent',
            data: eventObj
          }).done(function(res) {
            WIU.animate.leavePage(window.location.href);
            // console.log('updated successful');
          });
        }
        else {
          $('.error-name').removeClass('hidden');

          return false;
        }
        
      });
    },
    bindDeleteButton = function() {
      $('.delete-btn', '.button-row').on('click', function(e) {
        $.ajax({
          method: 'DELETE',
          url: '/event/delete/' + window.location.href.match(/\d*$/)[0]
        }).done(function(res) {
          WIU.animate.leavePage('/profile/getuser/' + $('#hostLabel').attr('data-id'));
        });
      });
    },
    getLatLong = function() {
      return $('.latlong').val();
    },
    readyStaticMap = function() {
      var key = 'AIzaSyAxQrQpPeVTP0SFDubCMCNtDaRqOjM-fxk',
          latlong = getLatLong(),
          url = '',
          $map = $('.map-image', '.map');

      latlong = latlong || '-33.8569,151.2152';
      url = "https://maps.googleapis.com/maps/api/staticmap?markers=" + latlong + "&center=" + latlong + "&zoom=12&size=350x200&key=" + key;

      if ($map.length) {
        $map.attr('src', url);
      }
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
        $('.g-map').attr('src', url);
      }
      else {
        // no map
      }
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
      var page = '.event-page',
          eventName = $('.event-name', page).val(),
          eventDate = $('.event-date', page).val(),
          eventTime = $('.start-time', page).val(),
          location  = $('.location', page).val(),
          eventDesc = $('.event-desc', page).val(),
          isPrivate = $('.is-private-cb', page).is(':checked'),
          checkedCategories = getEventCategory();

          suggestCB = $('.suggest-cb', page).is(':checked'),
          locationObj = {
            name : location
          };

      if (suggestCB) {
        locationObj.placeID = $('.place-id-new', page).val();
        locationObj.latlng  = $('.latlong-new', page).val();
        locationObj.formatted = $('.formatted-addy-new', page).val();
      }
      else {
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
        geoData   : locationObj,
        categories: JSON.stringify(checkedCategories),
        invite    : {
          username  : $('#inviteUser').val(),
          eventId   : window.location.href.match(/\d*$/)[0],  
        }
      };
    },
    populateAutocomplete = function() {
      var userNames = [];
      $.ajax({
        method: 'GET',
        url: '../profile/'
      }).done(function(users) {
        for(var i = 0; i < users.length; i++) {
          userNames.push(users[i].username);
        }
        $('#inviteUser').autocomplete({
          minLength: 3,
          delay: 50,
          appendTo: '#inviteUserSearchContainer',
          source: userNames
        });
      });
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
    fillHiddenFields = function(obj){ 
      var page = '.event-page',
          $placeID = $('.place-id-new', page),
          $latlong = $('.latlong-new', page),
          $formatted = $('.formatted-addy-new', page);

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
    initAddressComplete = function() {
      var $location = $('.location', '.edit-event');

      $location.on('blur', function() {

        var address = $location.val();

        if (typeof address !== 'undefined' && address.trim() != '' && address.trim().length > 1) {
          geocodeAddress(address.trim(), function(obj) {
            fillHiddenFields(obj);
            showSuggestion(obj);
          });
        }
      });
    },
    updateCTA = function(status) {
      if (status === 'G') { // show cancel RSVP btn
        $('.rsvp-btn', '.cta').addClass('hidden');
        $('.cancel-rsvp-btn', '.cta').removeClass('hidden');
      }
      else { // show RSVP btn
        $('.rsvp-btn', '.cta').removeClass('hidden');
        $('.cancel-rsvp-btn', '.cta').addClass('hidden');
      }
    },
    initCTA = function() {
      if (isInvited) {
        updateCTA('G');
      }
      else {
        updateCTA();
      }
    },
    updateInvite = function(obj) {
      $.ajax({
        method: 'PUT',
        url: '/event/updatestatus',
        data: {
          status: obj.status,
          eventId: obj.eventId,
          userId: obj.userId,
        }
      }).done(function(res) {
        updateCTA(obj.status);
      });
    },
    cancelInvite = function(obj) {
      $.ajax({
        method: 'PUT',
        url: '/event/uninvite',
        data: {
          eventId: obj.eventId,
          userId: obj.userId,
        }
      }).done(function(res) {
        updateCTA(obj.status);
      });
    },
    userIsInvited = function(callback) {

      var userID = parseInt($('.user-id', '.event-page').val());

      $.ajax({
        method: 'POST',
        url: '/event/userisinvited',
        data: {
          userId: userID,
          eventId: window.location.href.match(/\d*$/)[0]
        }
      })
      .done(function(res) {
        if (res == true) {
          isInvited = true;
        }
        else {
          isInvited = false;
        }

        if (typeof callback === 'function') {
          callback();
        }
      });
    },
    bindRSVPBtn = function () {
      var $rsvpBtn = $('.rsvp-btn', '.event-page');

      $rsvpBtn.on('click', function() {
        var userID = parseInt($(this).attr('data-uid'));

        if (isInvited) {
          updateInvite({
            status  : 'G',
            eventId : window.location.href.match(/\d*$/)[0],
            userId  : userID,
          });
        }
        else {
          $.ajax({
            method: 'POST',
            url: '/event/addinvite',
            data: {
              username: $('.username').val(),
              eventId: window.location.href.match(/\d*$/)[0]
            }
          })
          .done(function(res) {
            updateInvite({
              status  : 'G',
              eventId : window.location.href.match(/\d*$/)[0],
              userId  : userID,
            });
          });
        }
      });
    },
    bindCancelRSVPBtn = function() {
      var $cancelBtn = $('.cancel-rsvp-btn', '.event-page');

      $cancelBtn.on('click', function() {
        var userID = parseInt($(this).attr('data-uid'));

        cancelInvite({
          status  : 'U',
          eventId : window.location.href.match(/\d*$/)[0],
          userId  : userID,
        });
      });
    },
    init = function () {
      if ($('.event-page').length) {
        userIsInvited(function() {
          initCTA();
          bindFacebookShare();
          bindUpdateButton();
          bindDeleteButton();
          populateAutocomplete();
          readyStaticMap();
          initAddressComplete();
          bindRSVPBtn();
          bindCancelRSVPBtn();
        });
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

