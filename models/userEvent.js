module.exports = function(sequelize, DataTypes) {
    var UserEvent = sequelize.define("UserEvent", {
        // columns go here
    });

    UserEvent.associate = function(model) {
        model.Users.belongsToMany(model.Events, { through: UserEvent});
        model.Events.belongsToMany(model.Users, { through: UserEvent});
    }

    return UserEvent;
}