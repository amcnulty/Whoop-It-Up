/**
 * Page Routes
 * -----------
 * 
 * This file is the main router for the application.
 */
var express = require('express');
var router = express.Router();
var db = require('../models');
var categoryHandler = require('../logic/categoryHandler');
/* Render home page. */
router.get('/', function (req, res, next) {
  res.render('index', {user: req.session.user});
});
/** Render create event page. */
router.get('/create-event', function (req, res, next) {
  db.Category.findAll({}).then(function(results) {
    res.render('create-event', {
      user: req.session.user,
      title: 'Create Event',
      categories: categoryHandler.organizeCategories(results)
    });
  });
});
/** Render find events page. */
router.get('/find-events', function (req, res, next) {
  db.Category.findAll({}).then(function(results) {
    res.render('find-events', { 
      user: req.session.user,
      title: 'Find Events',
      categories: categoryHandler.organizeCategories(results)
    });
  });
});
/** Render the sign up page. */
router.get('/signup', function (req, res, next) {
  res.render('signup', {
    user: req.session.user,
    title: 'Signup'
  });
});
/** Render the events page. */
router.get('/events', function (req, res, next) {
  db.Event.findAll({}).then(function(events) {
    console.log(JSON.stringify(events, null, 2));
    res.render('events', {
      user: req.session.user,
      title: 'Events',
      events: events
    });
  });
});

module.exports = router;