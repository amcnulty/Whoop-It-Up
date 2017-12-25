var WIU = WIU || {};

WIU.event = (function () {

  var
    bindFacebookShare = function() {
      var $fbBtn = $('.fb-btn'),
      currentURL = window.location.href,
      shareURL = 'https://www.facebook.com/sharer/sharer.php?u=';
      
      $fbBtn.attr('href', shareURL + currentURL);
    },
    bindUpdateButton = function() {
      $('.update-btn', '.button-row').on('click', function(e) {
        $.ajax({
          method: 'POST',
          url: '../event/addinvite',
          data: {
            eventId: window.location.href.match(/\d*$/)[0],
            username: $('#inviteUser').val()
          }
        }).done(function(res) {
          WIU.animate.leavePage('/profile/getuser/' + $('#hostLabel').attr('data-id'));
        });
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
    init = function () {
      if ($('.event-page').length) {
        bindFacebookShare();
        bindUpdateButton();
        bindDeleteButton();
        populateAutocomplete();
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

