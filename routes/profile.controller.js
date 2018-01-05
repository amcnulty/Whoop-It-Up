/**
 * Profile Controller
 * ------------------
 * 
 * The profile controller handles requests related to user information, performs
 * application logic, and performs database operations to the users table and the
 * users join tables.
 */
var express = require('express');
var router = express.Router();
var db = require('../models');
var passwordHandler = require('../logic/passwordHandler');
var eventHandler = require('../logic/eventHandler');
var profileEvents = require('../logic/profileEvents');
/* GET users listing. */
router.get('/', function(req, res, next) {
    db.User.findAll({})
    .then(function(dbGet) {
      res.json(dbGet);
    });
});
/* Renders the user profile page for the given userId. */
router.get('/getuser/:id', function(req, res) {
  db.User.findOne({
    where: {
      id: req.params.id
    }
  })
  .then(function(dbGet) {
    if (typeof dbGet === 'undefined' || dbGet == null) {
      res.render('error', {message: 'Invalid user ID'});
    }
    else {
      db.UserEvent.findAll({
        attributes: ["status"],
        where: {
          UserId: req.params.id
        },
        include: [db.Event]
      })
      .then(function(events) {
        for (var i =0; i < events.length; i++) {
            var mmdd = events[i].Event.date.split('/')
            events[i].Event.date = mmdd[0] + '/' + mmdd[1];
        }        
        var categorizedEvents = profileEvents.categorize(events, dbGet.id),
            canEdit = false;

        if (req.session.user && dbGet.id === req.session.user.id) {
          canEdit = true;
        }
        console.log('render', categorizedEvents.invited);
        res.render('profile', {
          user      : req.session.user,
          canEdit   : canEdit,
          title     : 'Profile',
          id        : dbGet.id,
          avatar    : dbGet.avatar,
          email     : dbGet.email,
          username  : dbGet.username,
          invites   : categorizedEvents.invited,
          hosting   : categorizedEvents.hosting
        });
      });
    }
  });
});
/* User sign up route. */
router.post('/signup', function(req, res, next) {
  let password = req.body.password;
  let username = req.body.username;
  let email = req.body.email;
  let avatar = req.body.avatar;
  passwordHandler.hashPassword(password, function(hashedPassword) {
    db.User.create({
      password: hashedPassword,
      username: username,
      email: email,
      avatar: avatar
    }).then(function(savedUser) {
      return res.status(200).json(savedUser).end();
    }).catch(function (err) {
      console.log(err);
      return res.status(409).end();
    });
  });
});
/** Signs a user in and starts a session. */
router.post('/signin', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  db.User.findOne({
    where: {
      email: email
    }
  }).then(function(myUser) {
    if (typeof oldPw === 'undefined' || oldPw == null) {
      res.status(404).end();
    }
    else {
      passwordHandler.comparePassword(password, myUser.password, function(success) {
        if (success) {
          req.session.user = myUser;
          res.status(200).json(req.session.user).end();
        }
        else {
          res.status(404).end();
        }
      });  
    }
  });
});
// Check if the new password is the same as the password stored in the table.
router.post('/checksamepwd', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  db.User.findOne({
    where: {
      email: email
    }
  }).then(function(myUser) {
    passwordHandler.comparePassword(password, myUser.password, function(samePwd) {
      if (samePwd) { //Both old and new passwords are the same
        return res.send(true).end();
      }
      else {
         return res.send(false).end();
      }
    });
  });
});
// Replace the password in the table after hashing
router.put('/updatepwd', function(req, res, next) {
  let password = req.body.password;
  passwordHandler.hashPassword(password, function(hashedPassword) {
    db.User.update({
        password: hashedPassword
    },
    {
        where: {
            email: req.body.email
        }
    })
        .then(function(results) {
            res.status(200).end();
        });
  });
});
/** Route for when user updates profile */
router.put('/updateuser', function(req, res, next) {
  db.User.findOne({
    where: {
      Id: req.body.userId
    }
  })
  .then(function(user) {
    var oldPw = req.body.oldPW;

    // NOT updating password
    if (typeof oldPw === 'undefined' || oldPw == null) {
      db.User.update({
        avatar: req.body.avatar,
        username: req.body.username,
      },
      {
        where: {
          Id: req.body.userId
        }
      })
      .then(function(results) {
          res.status(200).end();
        })
      .catch(function(err) {
        if (err) console.log(err);
        res.status(500).end();
      });
    }
    // updating password
    else {
      passwordHandler.comparePassword(req.body.oldPW, user.password, function(isMatch) {
        if (isMatch) {
          passwordHandler.hashPassword(req.body.newPW, function(hashedPassword) {
            db.User.update({
              avatar: req.body.avatar,
              username: req.body.username,
              password: hashedPassword
            },
            {
              where: {
                Id: req.body.userId
              }
            })
            .then(function(results) {
              res.status(200).end();
            })
            .catch(function(err) {
              if (err) console.log(err);
              res.status(500).end();
            });
          });
        }
        else {
          return res.status(401).end();
        }
      });
    }
    
  });
});
/** Get all categories in the database. */
router.get('/allcategory', function(req, res, next) {
    db.Category.findAll({}).then(function(allCat) {
        res.status(200).json(allCat);
    });
});
/** Signs a user out and ends the session. */
router.post('/signout', function(req, res, next) {
  req.session.destroy();
  res.status(200).end();
});
/** Deletes user from database. */
router.delete('/delete/:userId', function(req, res, next) {
  db.UserEvent.findAll({
    attributes: [],
    where: {
      UserId: req.params.userId
    },
    include: [db.Event]
  })
  .then(function(events) {
    db.Event.destroy({
      where: {
        id: eventHandler.getIds(events)
      }
    })
    .then(function(response) {
      db.User.destroy({
        where: {
          id: req.params.userId
        }
      })
      .then(function(results) {
          req.session.destroy();
          res.status(200).end();
        });
      });
  });
});
/** Checks if a user is signed in with the session. */
router.get('/userpresent', function(req, res, next) {
  if(!req.session.user) {
    return res.send(false).end();
  }
  else return res.send(true).end();
});
/** Returns all of the events a user is associated with. */
router.get('/:id/events', function(req, res, next) {
  db.UserEvent.findAll({
    attributes: ["status"],
    where: {
      UserId: req.params.id
    },
    include: [db.Event]
  })
    .then(function(events) {
      for (var i =0; i < events.length; i++) {
          var mmdd = events[i].Event.date.split('/')
          events[i].Event.date = mmdd[0] + '/' + mmdd[1];
      }        
      res.status(200).json(events).end();
  })
  .catch(function(err) {
    if (err) {
      console.log(err);
      res.status(500).end();
    }
  });
});

module.exports = router;