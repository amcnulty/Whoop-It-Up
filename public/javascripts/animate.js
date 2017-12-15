var WIU = WIU || {};

WIU.animate = (function() {

  var 
  breakWords = function($wordsDiv, callback) {
    var words = $wordsDiv.attr('data-id');

    if (typeof words === 'string' && words.trim() !== '') {
      var wordsArr = words.trim().split(' ');

      $.each(wordsArr, function(index, word) {
        var $newDiv = $('<div class="wiu-animate">' + word + '</div>');
        $wordsDiv.append($newDiv);
      });

      callback($wordsDiv);
    }
  },
  getNextStagger = function(stagger, lastIndex) {
    return stagger * lastIndex;
  },
  apply = function($div, effect) {
    if (effect !== '') {
      $div.addClass('animated ' + effect);

      $div.off('oanimationend animationend webkitAnimationEnd').on('oanimationend animationend webkitAnimationEnd', function() {
        $div.removeClass('animated ' + effect);
      })
    }
  },
  bounceWords = function($wordsDiv, stagger, callback) {
    stagger = typeof stagger !== 'undefined' ? stagger : 0;    

    breakWords($wordsDiv, function() {
      var $toBounce = $wordsDiv.find('.wiu-animate');

      $toBounce.each(function(index) {
        var $this = $(this); 
        setTimeout(function() {
          apply($this, 'bounce');
        }, stagger * index);
      });

      if (typeof callback === 'function') {
        var nextStagger = getNextStagger(stagger, $toBounce.length);
        setTimeout(function() {
          callback();
        }, nextStagger);
      }
      
    });
  },
  slideIn = function($divs) {
    var timeline = new TimelineLite({paused: true});

    $divs.each(function(index) {
      var $this = $(this);
      timeline.fromTo($this, 0.3, 
            {opacity: 0, right: -90}, 
            {opacity: 1, right: 0});
    });

    timeline.play();
    
  };

  return {
    bounceWords : bounceWords,
    apply : apply,
    slideIn : slideIn
  }
})();