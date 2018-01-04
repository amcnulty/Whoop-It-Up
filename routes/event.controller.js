/**
 * Event Controller
 * ----------------
 * 
 * The event controller handles requests related to events, performs application
 * logic, and performs database operations to the events table and the event join tables.
 */
var express = require('express');
var router = express.Router();
var db = require('../models');
var eventHandler = require('../logic/eventHandler');
var categoryHandler = require('../logic/categoryHandler');
const Op = db.Sequelize.Op;

/** Create a new event */
router.post('/createevent', function (req, res, next) {
    // console.log(req.body);

    var placeId = req.body['geoData[placeID]'];
    var latLng = req.body['geoData[latlng]'];
    var formattedAddr = req.body['geoData[formatted]'];

    if (typeof (placeId) === 'undefined' || placeId == null || 
        typeof (latLng) === 'undefined' || latLng == null || 
        typeof (formattedAddr) === 'undefined' || formattedAddr == null) {
        placeId = '';
        latLng = '';
        formattedAddr = '';
    }
    
    db.Event.create({
        name: req.body.name,
        description: req.body.description,
        host: req.body.host,
        hostId: req.body.hostId,
        isPrivate: req.body.isPrivate,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        placeId: placeId,
        latLng: latLng,
        formattedAddr: formattedAddr
    })
    .then(function (savedEvent) {
        db.UserEvent.create({
            EventId: savedEvent.dataValues.id,
            UserId: req.body.hostId,
            status: 'G'
        })
        .then(function (result) {
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
                .then(function () {
                    res.status(200).json(savedEvent);
                });
        });
    });
});

/** Update Event */
router.post('/updateevent', function (req, res, next) {

    // console.log('Inside updateevent : ', req.body);
    // console.log('req.session.user.id ', req.session.user.id);
   
    var placeId = req.body['geoData[placeID]'];
    var latLng = req.body['geoData[latlng]'];
    var formattedAddr = req.body['geoData[formatted]'];

    if (typeof (placeId) === 'undefined' || placeId == null || 
        typeof (latLng) === 'undefined' || latLng == null || 
        typeof (formattedAddr) === 'undefined' || formattedAddr == null) {
        placeId = '';
        latLng = '';
        formattedAddr = '';
    }
    
    db.Event.update({
        name: req.body.name,
        description: req.body.description,
        isPrivate: req.body.isPrivate,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        placeId: placeId,
        latLng: latLng,
        formattedAddr: formattedAddr
    },
        {
            where: { id: req.body['invite[eventId]'] }
        })
    .then(function (savedEvent) {
        // console.log('savedEvent : ',savedEvent);
        db.User.findOne({
            where: {
                username: req.body['invite[username]']
            }
        }).then(function(user) {
            db.UserEvent.create({
                EventId: req.body['invite[eventId]'],
                UserId: user.dataValues.id
            }).then(function (savedInvite) {
                // return res.status(200).end();
                }).catch(function (err) {
                    if (err) {
                        console.log(err);
                    // return res.status(500).end();
                    }
                })
            })
        .then(function (result) {
            const eventId = req.body['invite[eventId]'];
            const categoryIds = JSON.parse(req.body.categories);
            db.EventCategory.destroy({
                where : {
                    EventId: eventId
                }
            }).then(function(addCat) { 

                const promises = categoryIds.map(function (categoryId) {
                    db.EventCategory.create({
                        EventId: eventId,
                        CategoryId: categoryId
                    });  

                });
                Promise
                    .all(promises)
                    .then(function () {
                        // res.status(200).json(savedEvent);
                    });
            });
        });
        res.status(200).end();
    });
});    


/** Get all of the events for all of the categories specified. */
router.get('/bycategory', function (req, res, next) {
    var eventCatArray = req.query.cid.split(" ");
    for (var j=0; j < eventCatArray.length; j++) {
        eventCatArray[j] = +eventCatArray[j];
    }
    db.EventCategory.findAll({
        attributes: [],
        include: [{model:db.Event,
                where: {
                    isPrivate: false
                },
            }],
        where: {
            CategoryId: {
                [Op.or]: eventCatArray
            }
        }
    }).then(function (events) {
        for (var i =0; i < events.length; i++) {
            var mmdd = events[i].Event.date.split('/')
            events[i].Event.date = mmdd[0] + '/' + mmdd[1];
            // console.log(events[i].Event.isPrivate);
        }        
        eventHandler.prepareForView(events, function(preparedEvents) {
            res.render('events', {
                user: req.session.user,
                title: 'Events',
                events: preparedEvents
            });
        });
    });
});

/** Get a single event by it's ID */
router.get('/:id', function (req, res, next) {
    // console.log('Inside get/:id : ',req.params);
    
    db.Event.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: db.Category,
            as: "categories"
        }]
    }).then(function (myEvent) {
        if (typeof myEvent === 'undefined' || myEvent == null) {
            res.render('error', { message: 'Invalid Event ID' });
        }
        else {
            var mmdd = myEvent.date.split('/');
            myEvent.date = mmdd[0] + '/' + mmdd[1];
            var isHost = false;
            var isInvited = false; 
                eventObj = {
                    isHost: isHost,
                    isInvited : isInvited,
                    user: req.session.user,
                    id: myEvent.id,
                    name: myEvent.name,
                    date: myEvent.date,
                    time: myEvent.time,
                    isPrivate: myEvent.isPrivate,
                    location: myEvent.location,
                    description: myEvent.description,
                    placeId: myEvent.placeId,
                    latLng: myEvent.latLng,
                    formattedAddr: myEvent.formattedAddr
                };

            if (typeof (req.session) !== 'undefined' &&
                typeof (req.session.user) !== 'undefined' &&
                typeof (req.session.user.id) !== 'undefined') {
                isHost = req.session.user.id == myEvent.hostId ? true : false;
                eventObj.isHost = isHost;
            // check is the current user (req.session.user.id) is invited to this
            // current event (myEvent.id), if so, set eventObj.isInvited = true
                db.UserEvent.findOne({
                    where: {
                        EventId: myEvent.id,
                        UserId: req.session.user.id
                    }
                })
                .then(function (checkEvent) {
                    isInvited = checkEvent.status !== ' ' ? true : false;
                    eventObj.isInvited = isInvited;
                })
            }
            db.Category.findAll({})
            .then(function(allCategories) {
                db.EventCategory.findAll({
                    attributes: [],
                    include: [db.Category],
                    where: {
                        EventId: eventObj.id
                    }
                })
                .then(function(eventCategories) {
                    if (typeof eventCategories !== 'undefined' && eventCategories != null) {
                        eventObj.categories = categoryHandler.findMatchedCategories(allCategories, eventCategories);    
                    }
                    console.log('heyhey', eventObj);
                    res.render('event', eventObj);
                });
            });
        }
    }); 
});

/** Get all of the events in the database */
router.get('/', function (req, res, next) {
    db.Event.findAll({}).then(function (events) {
        for (var i =0; i < events.length; i++) {
            var mmdd = events[i].date.split('/')
            events[i].date = mmdd[0] + '/' + mmdd[1];
            }
        res.status(200).json(events);
    });
});

/** Get the categories associated with an event */
router.get('/allcategories/:eventId', function(req, res, next) {
    db.EventCategory.findAll({
        attributes: [],
        include: [db.Category],
        where: {
            EventId: req.params.eventId
        }
    }).then(function(categories) {
        return res.status(200).send(categories).end();
    }).catch(function(err) {
        if (err) {
            console.log(err);
            return res.status(500).end();
        }
        return res.status(404).end();
    })
});
/** Invite a user to an event */
router.post('/addinvite', function (req, res, next) {
    db.User.findOne({
        where: {
            username: req.body.username
        }
    }).then(function(user) {
        db.UserEvent.create({
            EventId: req.body.eventId,
            UserId: user.dataValues.id
        }).
            then(function (savedInvite) {
                return res.status(200).end();
            })
            .catch(function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).end();
                }
            });
    });
});
/** Updates the status of a user for an event. */
router.put('/updatestatus', function (req, res, next) {
    db.UserEvent.update({
        status: req.body.status
    },
        {
            where: {
                EventId: req.body.eventId,
                UserId: req.body.userId
            }
        })
        .then(function (results) {
            res.status(200).end();
        });
});
/** Uninvite a user from an event */
router.put('/uninvite', function (req, res, next) {
    db.UserEvent.destroy({
        where: {
            UserId: req.body.userId,
            EventId: req.body.eventId
        }
    })
        .then(function (results) {
            res.status(200).end();
        });
});
/** Get all users associated to an event with their status. */
router.get('/invites/:eventId', function (req, res, next) {
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
router.delete('/delete/:eventId', function (req, res, next) {
    db.Event.destroy({
        where: {
            id: req.params.eventId
        }
    })
        .then(function (results) {
            res.status(200).end();
        });
});
/* Checks to see if a single user is invited to a single event */
router.post('/userisinvited', function (req, res, next) {
    db.UserEvent.findOne({
        where: {
            UserId: req.body.userId,
            EventId: req.body.eventId
        }
    })
    .then(function (userEvent) {
        if (!userEvent) res.send(false).end();
        else res.send(true).end();
    });
});

module.exports = router;