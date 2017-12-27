/**
 * Event Handler
 * -------------
 * 
 * This file is used for handling logical operations and tasks that involve the event records
 * from the database. Information about events need to manipulated for use with the view.
 */
const eventHandler = {
    /**
     * Prepares event results from the database for the view.
     * @param {Object[]} events - Events from the database
     * @param {Function} cb - Callback function that passes the prepared events.
     */
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
    /**
     * Returns an array of the ids associated with the events passed to this method.
     * @param {Object[]} events - Events from the database
     * @returns {Number[]}
     */
    getIds(events) {
        let ids = [];
        for (var i = 0; i < events.length; i++) {
            ids.push(events[i].Event.id);
        }
        return ids;
    }
}

module.exports = eventHandler;