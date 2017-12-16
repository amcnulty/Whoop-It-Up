var WIU = WIU || {};

WIU.landing = (function() {

  var 
  initFindBtn = function() {
    var $findBtn = $('.find-btn');
    $findBtn.on('click', function() {
      WIU.animate.leavePage('/find-events');
    });
  },
  initCreateBtn = function() {
    var $findBtn = $('.create-btn');
    $findBtn.on('click', function() {
      WIU.animate.leavePage('/create-event');
    });
  },
  startAnimate = function() {
    // animate title
    WIU.animate.bounceWords($('.main-title'), 400, function() {
      WIU.animate.apply($('.site-logo'), 'rubberBand');
    });
    WIU.animate.slideIn($('.btn'));
  },
  init = function() {
    if ($('.landing-page').length) {
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