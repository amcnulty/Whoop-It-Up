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