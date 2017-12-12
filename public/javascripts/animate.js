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
  bounceWords = function($wordsDiv, stagger){
    stagger = typeof stagger !== 'undefined' ? stagger : 0;

    breakWords($wordsDiv, function() {
      var $toBounce = $wordsDiv.find('.wiu-animate');

      $.each($toBounce, function(index, bounespan) {
        setTimeout(function() {
          $(bounespan).addClass('animated bounce')
        }, stagger * index);
      });
    });
  };

  return {
    bounceWords : bounceWords
  }
})();