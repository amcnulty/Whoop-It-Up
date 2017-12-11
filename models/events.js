module.exports = function(sequelize, DataTypes) {
    var Events = sequelize.define("Events", {
        // columns go here
    });

    Events.associate = function(model) {
        console.log(model);
        Events.belongsToMany(model.Categories, {
            through: "EventCategory"
        });

        Events.belongsToMany(model.Users, {
            through: "UserEvent"
        });
    }

    return Events;
}