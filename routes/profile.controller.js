var express = require('express');
var router = express.Router();
var db = require('../models');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id', function(req, res, next) {
  res.render('index', {
    title: 'Profile', 
    id: req.params.id
  });
});

module.exports = router;
