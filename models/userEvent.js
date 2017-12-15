module.exports = function(sequelize, DataTypes) {
    
    const UserEvent = sequelize.define('UserEvent', {
        EventId: DataTypes.BIGINT,
        UserId: DataTypes.BIGINT
    });

    UserEvent.associate = function(model) {
        UserEvent.belongsTo(model.Event);
        UserEvent.belongsTo(model.User);
    }

    return UserEvent;
}