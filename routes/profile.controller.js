var express = require('express');
var router = express.Router();
var db = require('../models');
var passwordHandler = require('../logic/passwordHandler');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// TODO: remove `canEdit`, this should be from $_SESSION variable
router.get('/:id', function(req, res, next) {
  res.render('profile', {
    title     : 'Profile', 
    id        : req.params.id,
    avatar    : 1,
    email     : 'test@testeste.edu',
    username  : 'Andy K',
    canEdit   : true
  });
});
/* User sign up route */
router.post('/signup', function(req, res, next) {
  let hashedPassword = passwordHandler.hashPassword("req.params.password");
  res.status(200).end();
});

module.exports = router;