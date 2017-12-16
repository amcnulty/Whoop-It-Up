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
    }
}

module.exports = categoryHandler;