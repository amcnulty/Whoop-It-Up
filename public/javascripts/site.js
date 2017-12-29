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
    startTitleAnimate = function() {
      WIU.animate.apply($('h2.fun-font'), 'tada'); 
    },
    playSiteLogoAnimate = function() {
      var effects = ['swing', 'bounce', 'flash', 'jello', 'rubberBand', 'pulse'],
          $siteLogo = $('.site-logo');

      if ($siteLogo.length) {
        WIU.animate.apply($siteLogo, effects[getRand(0, effects.length-1)]);
      }
    },
    init = function () {
      putBackground($('.top-region'));
      putBackground($('.bottom-region'));

      WIU.animate.bkgSlideIn($('.top-region'));
      WIU.animate.bkgSlideIn($('.bottom-region'));

      var animteSiteLogo = setInterval(playSiteLogoAnimate, 4500);
      
      startTitleAnimate();
    };

  return {
    init: init
  }
})();

$(function () {
  WIU.site.init();
});