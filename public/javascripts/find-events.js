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
  findEvent = function () {
    var findEvent = $('.event-search-box').val();
    if (findEvent === "") {
      return false;
    } else {
      return true;
    }
  },
  bindFindBtn = function () {
    var $findBtn = $('.find-btn');

    $findBtn.on('click', function () {
      var checkedCategories = getEventCategory();

      // console.log('hey', checkedCategories.join('+'));
      window.location = './event/bycategory/?cid=' + checkedCategories.join('+');
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