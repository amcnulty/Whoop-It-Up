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