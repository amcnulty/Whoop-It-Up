var express = require('express');
var router = express.Router();
var db = require('../models');
var categoryHandler = require('../logic/categoryHandler');

/* GET home page. */
router.get('/', function (req, res, next) {
  // console.log('hey fuck', {user: req.session.user});
  res.render('index', {user: req.session.user});
});

router.get('/create-event', function (req, res, next) {
  db.Category.findAll({}).then(function(results) {
    res.render('create-event', {
      user: req.session.user,
      title: 'Create Event',
      categories: categoryHandler.organizeCategories(results)
    });
  });
});

router.get('/find-events', function (req, res, next) {
  res.render('find-events', { 
    user: req.session.user,
    title: 'Find Events'
  });
});

router.get('/signup', function (req, res, next) {
  res.render('signup', {
    user: req.session.user,
    title: 'Signup'
  });
});

// date should be a timestamp
// location should be lat and long value for used w. the google map API
router.get('/events', function (req, res, next) {
  db.Event.findAll({}).then(function(events) {
    res.render('events', {
      user: req.session.user,
      title: 'Events',
      events: events
    });
  });
});
  module.exports = router;
