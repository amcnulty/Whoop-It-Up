var express = require('express');
var router = express.Router();
var db = require('../models');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {});
});

router.get('/create-event', function (req, res, next) {
  res.render('index', { title: 'Create Event' });
});

router.get('/find-events', function (req, res, next) {
  res.render('find-events', { title: 'Find Events' });
});

router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Signup' });
});

router.get('/events', function (req, res, next) {
  res.render('events', {
    title: 'Events',
    events: [{
      name: "Andy's Lan Party",
      date: "12/21/2017",
      location: "Andy's Place",
      description: "This is the best LAN party in the world!"
    }, {
      name: "Brendan's Pool Party",
      date: "12/21/2017",
      location: "Brendan's Place",
      description: "This is the best POOL party in the world!"
    }]
  });
});
  module.exports = router;
