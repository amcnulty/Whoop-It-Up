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