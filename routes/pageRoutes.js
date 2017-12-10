var express = require('express');
var router = express.Router();
var db = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/create-event', function(req, res, next) {
  res.render('index', { title: 'Create Event' });
});

router.get('/find-events', function(req, res, next) {
  res.render('find-events', { title: 'Find Events' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Signup' });
});

module.exports = router;
