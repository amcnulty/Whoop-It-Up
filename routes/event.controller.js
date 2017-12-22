var express = require('express');
var router = express.Router();
var db = require('../models');
/** Create a new event */
router.post('/createevent', function(req, res, next) {
    db.Event.create({
        name: req.body.name,
        description: req.body.description,
        host: req.body.host,
        hostId:req.body.hostId,
        isPrivate: req.body.isPrivate,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location
    })
    .then(function(savedEvent) {
       db.UserEvent.create({
        EventId: savedEvent.dataValues.id,
        UserId: req.body.hostId
        })
       .then(function(result) {
            const eventId = savedEvent.dataValues.id;
            const categoryIds = JSON.parse(req.body.categories);
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
            
           })
    });
});
/** Get a single event by it's ID */
router.get('/:id', function(req, res, next) {
    db.Event.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: db.Category,
            as: "categories"
        }]
    }).then(function(myEvent) {
        if (typeof myEvent === 'undefined' || myEvent == null) {
            res.render('event', {
              user  : req.session.user,
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
            var mmdd = myEvent.date.split('/')
            myEvent.date = mmdd[0] + '/' + mmdd[1];
            // res.status(200).json(myEvent);    
            var isHost = false,
                eventObj = {
                    isHost : isHost,
                    user : req.session.user,
                    id   : myEvent.id,
                    name : myEvent.name,
                    date : myEvent.date,
                    time : myEvent.time,
                    isPrivate : myEvent.isPrivate,
                    placeID : '',
                    location : myEvent.location,
                    description : myEvent.description,
                };

            if (typeof (req.session) !== 'undefined' && 
                typeof (req.session.user) !== 'undefined' &&
                typeof (req.session.user.id) !== 'undefined') {
                isHost = req.session.user.id == myEvent.hostId ? true : false;
                eventObj.isHost = isHost;
            }
            // DEBUG: remove later
            // eventObj.isHost = true;

            console.log('raw event item', eventObj);
            res.render('event', eventObj);
        }
        
    });
});

/** Get all of the events in the database */
router.get('/', function(req, res, next) {
    db.Event.findAll({}).then(function(events) {
        res.status(200).json(events);
    });
});
/** Get all of the events with a single category */
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
/** Invite a user to an event */
router.post('/addinvite', function(req, res, next) {
    console.log('event id : ',req.body.eventId);
    console.log('user id : ', req.body.userId);    
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
/** Updates the status of a user for an event. */
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
/** Uninvite a user from an event */
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
/** Get all users associated to an event with their status. */
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
/** Delete an event from the database */
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

/* Checks to see if a single user is invited to a single event */
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