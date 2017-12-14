var express = require('express');
var router = express.Router();
var db = require('../models');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {});
});


router.get('/create-event', function (req, res, next) {
  res.render('create-event', { title: 'Create Event' });
});

router.get('/find-events', function (req, res, next) {
  res.render('find-events', { title: 'Find Events' });
});

router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Signup' });
});

// date should be a timestamp
// location should be lat and long value for used w. the google map API
router.get('/events', function (req, res, next) {
  res.render('events', {
    title: 'Events',
    events: [{
      id : 0,
      name: "Andy's Lan Party",
      date: "12/12",
      location: "Andy's Place",
      description: "This is the best LAN party in the world!"
    }, {
      id : 1,
      name: "Brendan's Pool Party",
      date: "12/21",
      location: "Brendan's Place",
      description: "This is the best POOL party in the world!"
    },
    {
      id : 2,
      name: "Adobe design conference with Shubha",
      date: "12/30",
      location: "Google's main campus",
      description: "Let's learn how to design stuffs"
    },
    {
      id : 3,
      name: "Aaron's Graduation",
      date: "1/12",
      location: "UCSD",
      description: "Celebrating Aaron for getting his PhD."
    },
    {
      id : 4,
      name: "Winter quarter at UC Irvine",
      date: "1/30",
      location: "Univerisity of California, Irvine",
      description: "GDI!!! Back to school time"
    }]
  });
});
  module.exports = router;
