var WIU = WIU || {};

WIU.createEvent = (function() {

  var 
  geocodeAddress = function() {
    //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
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
        invites   = $('.invite', page).val();

    return {
      name      : eventName,
      date      : eventDate,
      time      : eventTime,
      location  : location,
      desc      : eventDesc,
      invites   : invites
    };
  },
  initCreateBtn = function() {
    var $createBtn = $('.create-btn');

    $createBtn.on('click', function(e) {
      var eventObj = getData();

      if (verifyData(eventObj)) {
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
      console.log('!!!');  
      initDatepicker();
      initCreateBtn();
    }
  };

  return {
    init : init
  }
})();

$(function() {
  WIU.createEvent.init();
});