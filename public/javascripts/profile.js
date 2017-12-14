var WIU = WIU || {};

WIU.profile = (function() {

  var 
  bindAvatarSelect = function() {
    var $avatarBtn = $('.avatar', '.avatar-section');
        
    $avatarBtn.on('click', function() {
      var $currAvatar = $('.current-avatar'),
          currentAID = $currAvatar.attr('data-id'),
          avatarID = $(this).attr('data-id'); 

      if (currentAID !== avatarID) {
        $currAvatar.attr('data-id', avatarID);
        $currAvatar.addClass('avatar-' + avatarID);
        $currAvatar.removeClass('avatar-' + currentAID);

        WIU.animate.apply($currAvatar, 'rubberBand'); 
      }
    });
  },
  confirmPassword = function(oldPW, newPW) {
    return (oldPW === newPW);
  },
  hasOldPassword = function(data) {
    if (typeof data.newPW !== 'undefined' && data.newPW !== null && data.newPW.trim() !== '') {
      if (typeof data.oldPW !== 'undefined' && data.oldPW.trim() !== '') {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  },
  verifyData = function(data) {
    var allGood = true;

    // hide all existing error messages
    $('.error').addClass('hidden');

    if (!confirmPassword(data.newPW, data.confirmPW)) {
      $('.error-confirm').removeClass('hidden');
      allGood = false;
    }

    if (!hasOldPassword(data)) {
      $('.error-old-pw').removeClass('hidden'); 
      allGood = false;
    }
    return allGood;
  },
  getUserData = function() {
    var editDiv = '.edit-profile',
        username = $('.username', editDiv).val(),
        oldPW = $('.old-pw', editDiv).val(),
        newPW = $('.new-pw', editDiv).val(),
        confirmPW = $('.confirm-pw', editDiv).val();

    return {
      username  : username,
      oldPW     : oldPW,
      newPW     : newPW,
      confirmPW : confirmPW
    };
  },
  bindUpdateBtn = function() {
    var $updateBtn = $('.update-btn');

    $updateBtn.on('click', function() {
      var data = getUserData();

      if (verifyData(data)) {
        console.log('user data is good: ', data);
      }
      else {
        console.log('problem with your input!')
      }
    });
  },
  isEventTab = function(classes) {
    return classes.indexOf('tab-events') !== -1;
  },
  bindTabShown = function() {
    var $navTabs = $('#profile-tabs');

    $navTabs.on('shown.bs.tab', function(e) {
      
      if (isEventTab(e.target.className)) {
        WIU.animate.slideIn($('.invite-row', '.event-section'));
      }
      else {
        $('.event-row').css('opacity', '0');
      }
    })
  },
  init = function() {
    if ($('.edit-profile', '.profile-page').length) {
      bindTabShown();
      bindAvatarSelect();
      bindUpdateBtn();
    }
  };

  return {
    init : init
  }
})();

$(function() {
  WIU.profile.init();
});