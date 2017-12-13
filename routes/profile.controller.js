var express = require('express');
var router = express.Router();
var db = require('../models');
var passwordHandler = require('../logic/passwordHandler');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

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
    db.Users.create({
      password: hashedPassword,
      username: username,
      email: email,
      avatar: avatar
    }).then(function(err, dbPost) {
      console.log("In profilecontroller");
      if (err) throw err;
      res.json(dbPost);
      res.status(200).end();
    });
  });
});

module.exports = router;