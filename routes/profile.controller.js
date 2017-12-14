var express = require('express');
var router = express.Router();
var db = require('../models');
var passwordHandler = require('../logic/passwordHandler');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
    db.User.findAll({})
    .then(function(dbGet) {
      res.json(dbGet);
    });

});

/* GET for single user listing. */
// router.get('/:id', function(req, res) {
//   // res.send('respond with a resource');
//     db.User.findOne({
//      where: {
//        id:req.params.id
//      }
//     }).then(function(dbGet) {
//       res.json(dbGet);
//     });
// });
// TODO: remove `canEdit`, this should be from $_SESSION variable
// `invites` should be a list of event the user is invited to 
// TODO: backend logic to only query upcoming events, ignore past events
router.get('/:id', function(req, res, next) {
  res.render('profile', {
    title     : 'Profile', 
    id        : req.params.id,
    avatar    : 1,
    email     : 'test@testeste.edu',
    username  : 'Andy K',
    canEdit   : true,
    invites   : [
      {
        id    : 0,
        name  : "Andy's Lan Party",
        date  : "12/12",
        location    : "Andy's Place",
        description : "This is the best LAN party in the world!",
        rsvp  : false,
      },
      {
        id    : 1,
        name  : "Brendan's Pool Party",
        date  : "12/21",
        location    : "Brendan's Place",
        description : "This is the best POOL party in the world!",
        rsvp  : true
      }
    ]
  });
});
/* User sign up route */
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
      res.json(savedUser);
      res.status(200).end();
    });
  });
});

router.post('/signin', function(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  db.User.findOne({
    email: email
  }).then(function(myUser) {
    passwordHandler.comparePassword(password, myUser.password, function(success) {
      if (success) {
        req.session.user = myUser;
        res.status(200).json(req.session.user);
      }
      else res.status(404).end();
    });
  });
});

module.exports = router;