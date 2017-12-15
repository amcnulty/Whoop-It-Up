var express = require('express');
var router = express.Router();
var db = require('../models');

router.post('/createevent', function(req, res, next) {
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
        if (typeof myEvent === 'undefined' || myEvent == null) {
            res.render('event', {
              id    : 1,
              name  : "Brendan's Pool Party",
              date  : "12/21",
              placeID : '',
              latlng : '-33.8569,151.2152',
              location    : "Brendan's Place",
              description : "This is the best POOL party in the world!"
            });
        }
        else {
            res.status(200).json(myEvent);    
        }
        
    });
});

router.get('/', function(req, res, next) {
    db.Event.findAll({}).then(function(events) {
        res.status(200).json(events);
    });
});

router.get('/bycategory/:categoryId', function(req, res, next) {
    db.EventCategory.findAll({
        attributes: [],
        include: [db.Event],
        where: {
            CategoryId: req.params.categoryId
        }
    }).then(function(events) {
        res.status(200).json(events);
    });
});

router.post('/addinvite', function(req, res, next) {
    db.UserEvent.create({
        EventId: req.body.eventId,
        UserId: req.body.userId
    }).
        then(function(savedInvite){
           return res.status(200).end();
        })
        .catch(function(err) {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }
        });
});
// Updates the status of a user for an event.
router.put('/updatestatus', function(req, res, next) {
    db.UserEvent.update({
        status: req.body.status
    },
    {
        where: {
            EventId: req.body.eventId,
            UserId: req.body.userId
        }
    })
        .then(function(results) {
            res.status(200).end();
        });
});

router.put('/uninvite', function(req, res, next) {
    db.UserEvent.destroy({
        where: {
            UserId: req.body.userId,
            EventId: req.body.eventId
        }
    })
        .then(function(results) {
            res.status(200).end();
        });
});
// Get all users associated to an event with their status.
router.get('/invites/:eventId', function(req, res, next) {
    db.UserEvent.findAll({
        attributes: ["status"],
        include: [db.User],
        where: {
            EventId: req.params.eventId
        }
    })
        .then(function (invitedUsers) {
            res.status(200).json(invitedUsers).end();
        });
});

router.delete('/delete/:eventId', function(req, res, next) {
    db.Event.destroy({
        where: {
            id: req.params.eventId
        }
    })
        .then(function(results) {
            res.status(200).end();
        });
});

// Checks to see if a single user is invited to a single event
router.post('/userisinvited', function(req, res, next) {
    db.UserEvent.findOne({
        where: {
            UserId: req.body.userId,
            EventId: req.body.eventId
        }
    })
        .then(function(userEvent) {
            if (!userEvent) res.send(false).end;
            else res.send(true).end();
        });
});

module.exports = router;