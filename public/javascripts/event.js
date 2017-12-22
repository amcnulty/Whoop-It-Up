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
    eventCategoryData = function() {
      $.ajax({
        method: 'POST',
        url: '',
        data: page
      }).done(function() {
        window.location = window.location.href;
      })
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

