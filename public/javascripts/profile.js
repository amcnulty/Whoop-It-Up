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
  hasNewPassword = function(data) {
    return !(typeof data.newPW === 'undefined' ||
              data.newPW === null ||
              data.newPW.trim() === '');
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

    // if user is trying to update his/her pw
    if (hasOldPassword(data)) {
      if (!hasNewPassword(data)) {
        $('.error-new-pw').removeClass('hidden');
        return false;
      }
      else if (!confirmPassword(data.newPW, data.confirmPW)) {
        $('.error-confirm').removeClass('hidden');
        return false;
      }
    }

    // if (!hasOldPassword(data)) {
    //   $('.error-old-pw').removeClass('hidden'); 
    //   return false;
    // }

    return true;
  },
  getUserData = function() {
    var editDiv = '.edit-profile',
        username = $('.username', editDiv).val(),
        oldPW = $('.old-pw', editDiv).val(),
        newPW = $('.new-pw', editDiv).val(),
        confirmPW = $('.confirm-pw', editDiv).val();

    return {
      userId: parseInt(window.location.href.match(/\d*$/)[0]),
      username  : username,
      avatar: $('.avatar').attr('data-id'),
      oldPW     : oldPW,
      newPW     : newPW,
      confirmPW : confirmPW
    };
  },
  modifyData = function(data) {
    if (!hasOldPassword(data) || !hasNewPassword(data)) {
      console.log('no need for pw data');
      return {
        userId : data.userId,
        username : data.username,
        avatar : data.avatar
      }
    }
    else {
      console.log('need pw data');
      return data;
    }
  },
  bindUpdateBtn = function() {
    var $updateBtn = $('.update-btn');

    $updateBtn.on('click', function() {
      var data = getUserData();

      if (verifyData(data)) {
        data = modifyData(data);
        console.log('hey!!!!', data);
        $.ajax({
          method: 'PUT',
          url: '/profile/updateuser',
          data: data
        }).done(function(res) {
          WIU.animate.leavePage(window.location.href);
        });
      }
      else {
        console.log('problem with your input!')
      }
    });
  },
  bindDeleteBtn = function() {
    $('.delete-btn').on('click', function(e) {
      $.ajax({
        method: 'DELETE',
        url: '/profile/delete/' + window.location.href.match(/\d*$/)[0]
      }).done(function(res) {
        WIU.animate.leavePage('/');
      });
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
  setInviteStatus = function ($inviteDiv, status) {
    if (status == 'G') {
      $inviteDiv.find('.fa-exclamation').removeClass('active');
      $inviteDiv.find('.fa-times').removeClass('active');
      $inviteDiv.find('.fa-check').addClass('active');
    }
    else if (status == 'D') {
      $inviteDiv.find('.fa-exclamation').removeClass('active');
      $inviteDiv.find('.fa-times').addClass('active');
      $inviteDiv.find('.fa-check').removeClass('active');
    }
  },
  updateInvite = function(obj) {
    $.ajax({
      method: 'PUT',
      url: '/event/updatestatus',
      data: {
        status: obj.status,
        eventId: obj.eventId,
        userId: obj.userId,
      }
    }).done(function(res) {
      console.log('update successful');
      
      setInviteStatus($('.invite-row.event-' + obj.eventId, '#events'), obj.status);
    });
  },
  bindGoBtn = function() {
    var $goBtn = $('.goBtn');

    $goBtn.on('click', function(e) {
      e.preventDefault();
      var eventId = $(this).attr('data-id'),
          dataObj = {
            status  : 'G',
            eventId : parseInt(eventId),
            userId  : parseInt(window.location.href.match(/\d*$/)[0])
          };

      updateInvite(dataObj);
    });
  },
  bindDeclineBtn = function() {
    var $declineBtn = $('.declineBtn');

    $declineBtn.on('click', function(e) {
      e.preventDefault();
      var eventId = $(this).attr('data-id'),
          dataObj = {
            status  : 'D',
            eventId : parseInt(eventId),
            userId  : parseInt(window.location.href.match(/\d*$/)[0])
          };

      updateInvite(dataObj);
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
      bindDeleteBtn();
      bindGoBtn();
      bindDeclineBtn();
    }
  };

  return {
    init : init
  }
})();

$(function() {
  WIU.profile.init();
});