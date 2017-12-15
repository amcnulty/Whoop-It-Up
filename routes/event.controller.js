var express = require('express');
var router = express.Router();
var db = require('../models');

router.post('/createEvent', function(req, res, next) {
    db.Event.create({
        eventName: req.body.eventName,
        isPublic: req.body.isPublic,
        eventDate: req.body.eventDate,
        eventTime: req.body.eventTime,
        location: req.body.location
    })
        .then(function(savedEvent) {
            const eventId = savedEvent.dataValues.id;
            const categoryIds = req.body.categories;
            const promises = categoryIds.map(function (categoryId) {
                return db.EventCategory.create({
                    EventId: eventId,
                    CategoryId: categoryId
                });
            });
            Promise
                .all(promises)
                .then(function() {
                    res.status(200).json(savedEvent);
                });
        });
});

router.get('/:id', function(req, res, next) {
    db.Event.findOne({
        id: req.params.id,
        include: [{
            model: db.Category,
            as: "categories"
        }]
    }).then(function(myEvent) {
        res.status(200).json(myEvent);
    });
});

router.get('/', function(req, res, next) {
    db.Event.findAll({}).then(function(events) {
        res.status(200).json(events);
    });
});

router.get('/bycategory/:categoryId', function(req, res, next) {
    db.EventCategory.findAll({
        include: [db.Event],
        where: {
            CategoryId: req.params.categoryId
        }
    }).then(function(events) {
        res.status(200).json(events);
    });
});

module.exports = router;