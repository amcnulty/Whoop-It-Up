var profileEvents = {
    /** Array to hold hosted events */
    hosting: [],
    /** Array to hold invited events */
    invited: [],
    /**
     * Categories array of events into hosted and invited arrays. Returns both arrays as object.
     * @param {Array} events 
     * @param {Number} userId 
     * @returns {Object}
     */
    categorize(events, userId) {    
        for (var i = 0; i < events.length; i++) {
            if (events[i].Event.hostId === userId) {
                this.hosting.push(events[i]);
            }
            else this.invited.push(events[i]);
        }
        return {
            hosting: this.hosting,
            invited: this.invited
        }
    }
}

module.exports = profileEvents;