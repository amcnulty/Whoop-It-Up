/**
 * Category Handler
 * ----------------
 * 
 * This file is used for handling logical operations and tasks that involve the categories of
 * events. Each event that is created in the app can have multiple categories and the category
 * information needs to be manipulated for use with the view and other parts of the app.
 */
const categoryHandler = {
    /**
     * This method returns the category information organized in a simple way for use with the view.
     * @param {Object[]} rawData - The data object received from the database query.
     * @returns {Object[]}
     */
    organizeCategories(rawData) {
        let organizedData = [];
        for (var i = 0; i < rawData.length; i++) {
            organizedData.push({
                id: rawData[i].dataValues.id,
                categoryname: rawData[i].dataValues.categoryname
            });
        }
        return organizedData;
    },
    /**
     * This method is used to find the categories that are included in a single event.
     * This is helpful for when displaying the event to show what categories are included.
     * On the edit event page this is used for deciding what check boxes to pre-check.
     * @param {Object[]} allCategories 
     * @param {Object[]} eventCategories 
     * @returns {Object[]}
     */
    findMatchedCategories(allCategories, eventCategories) {
        let orgCat = this.organizeCategories(allCategories);
        let match = false;
        for (var i = 0; i < allCategories.length; i++) {
            match = false;
            for (var ii = 0; ii < eventCategories.length; ii++) {
                if (allCategories[i].dataValues.id === eventCategories[ii].Category.dataValues.id) {
                    match = true;
                    break;
                }
            }
            orgCat[i].matched = match;
        }
        return orgCat;
    }
}

module.exports = categoryHandler;