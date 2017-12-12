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

      // animate title
      WIU.animate.bounceWords($('.main-title'), 400);

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