module.exports = function(sequelize, DataTypes) {
    var EventCategory = sequelize.define("EventCategory", {
        // columns go here
    });

    EventCategory.associate = function(model) {
        model.Events.belongsToMany(model.Categories, { through: EventCategory});
        model.Categories.belongsToMany(model.Events, { through: EventCategory});
    }

    return EventCategory;
}