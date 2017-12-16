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
  getRand = function(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  },
  startAnimate = function() {
    // animate title
    WIU.animate.bounceWords($('.main-title'), 400, function() {
      WIU.animate.apply($('.site-logo'), 'rubberBand');
      WIU.animate.bkgSlideIn($('.top-region'));
      WIU.animate.bkgSlideIn($('.bottom-region'));
    });
  },
  putBackground = function($div) {
    var bkgClass = 'country-' + getRand(0, 9);
    $div.addClass(bkgClass);
  },
  init = function() {
    if ($('.landing-page').length) {
      putBackground($('.top-region'));
      putBackground($('.bottom-region'));
      startAnimate();
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