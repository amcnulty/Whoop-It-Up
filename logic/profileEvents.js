/**
 * Profile Events
 * --------------
 * 
 * This file is used to do logical operations for events that are display on user profiles.
 */
var profileEvents = {
    /**
     * Categorizes array of events into hosted and invited arrays. Returns both arrays as object.
     * @param {Object[]} events - Events from the database
     * @param {Number} userId - The user id for the current profile
     * @returns {Object}
     */
    categorize(events, userId) { 
        let hosting = [];
        let invited = [];   
        for (var i = 0; i < events.length; i++) {
            if (events[i].Event.hostId === userId) {
                hosting.push(events[i]);
            }
            else invited.push(events[i]);
        }
        return {
            hosting: hosting,
            invited: invited
        }
    }
}

module.exports = profileEvents;