const categoryHandler = {
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