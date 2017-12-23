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
    if (typeof oldPW === 'undefined' || 
        oldPW === null ||
        oldPW.trim() === '' ||
        typeof newPW === 'undefined' ||
        newPW === null ||
        newPW.trim() === '') return false;
    return (oldPW === newPW);
  },
  hasOldPassword = function(data) {
    if (typeof data.oldPW === 'undefined' ||
        data.oldPW === null ||
        data.oldPW.trim() === '') return false;
        return true;
  },
  verifyData = function(data) {
    // hide all existing error messages
    $('.error').addClass('hidden');
    if (!hasOldPassword(data)) {
      $('.error-old-pw').removeClass('hidden'); 
      return false;
    }
    if (!confirmPassword(data.newPW, data.confirmPW)) {
      $('.error-confirm').removeClass('hidden');
      return false;
    }

    return true;
  },
  getUserData = function() {
    var editDiv = '.edit-profile',
        username = $('.username', editDiv).val(),
        oldPW = $('.old-pw', editDiv).val(),
        newPW = $('.new-pw', editDiv).val(),
        confirmPW = $('.confirm-pw', editDiv).val();

    return {
      userId: window.location.href.match(/\d*$/)[0],
      username  : username,
      avatar: $('.avatar').attr('data-id'),
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
        $.ajax({
          method: 'PUT',
          url: '/profile/updateuser',
          data: data
        }).done(function(res) {
          console.log(res);
        });
      }
      else {
        console.log('problem with your input!')
      }
    });
  },
  isEventTab = function(classes) {
    return classes.indexOf('tab-events') !== -1;
  },
  isHostTab = function(classes) {
    return classes.indexOf('tab-yours') !== -1;
  },
  bindTabShown = function() {
    var $navTabs = $('#profile-tabs');

    $navTabs.on('shown.bs.tab', function(e) {
      
      if (isEventTab(e.target.className)) {
        WIU.animate.slideIn($('.invite-row', '.event-section'));
      }
      else if (isHostTab(e.target.className)) {
        WIU.animate.slideIn($('.host-row', '.yours-section')); 
      }
    });
  },
  bindDeleteProfile = function() {
    var $delBtn = $('.delete-btn', '.control');

    $delBtn.on('click', function() {
      // popup modal to warning them
      // call api to delete
      // on success, redirect them back to the landing page
    });
  },
  bindAddEvent = function() {
    var $addEventBtn = $('.create-btn', '.yours-section');

    $addEventBtn.on('click', function() {
      WIU.animate.leavePage('/create-event'); 
    });
  },
  bindFindEvent = function() {
    var $addEventBtn = $('.find-btn', '.event-section');

    $addEventBtn.on('click', function() {
      WIU.animate.leavePage('/find-events');
    });
  },
  init = function() {
    if ($('.profile-page').length) {
      bindDeleteProfile();
      bindTabShown();
      bindAddEvent();
      bindFindEvent();
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