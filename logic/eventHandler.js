const eventHandler = {
    prepareForView(events, cb) {
        let preparedEvents = [];
        let event = {};
        let eventKeys;
        for (var i = 0; i < events.length; i++) {
            event = {};
            eventKeys = Object.keys(events[i].Event.dataValues);
            for (var ii = 0; ii < eventKeys.length; ii++) {
                event[eventKeys[ii]] = events[i].Event.dataValues[eventKeys[ii]];
            }
            preparedEvents.push(event);
        }
        cb(preparedEvents);
    },
    getIds(events) {
        let ids = [];
        for (var i = 0; i < events.length; i++) {
            ids.push(events[i].Event.id);
        }
        return ids;
    }
}

module.exports = eventHandler;