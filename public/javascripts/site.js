var WIU = WIU || {};

// JS that run on ALL pages
WIU.site = (function () {

  var
    getRand = function(min, max) {
      return Math.floor(Math.random()*(max-min+1)+min);
    }, 
    putBackground = function($div) {
      var bkgClass = 'country-' + getRand(0, 9);
      $div.addClass(bkgClass);
    },
    init = function () {
      putBackground($('.top-region'));
      putBackground($('.bottom-region'));

      WIU.animate.bkgSlideIn($('.top-region'));
      WIU.animate.bkgSlideIn($('.bottom-region'));
    };

  return {
    init: init
  }
})();

$(function () {
  WIU.site.init();
});