module.exports = function(sequelize, DataTypes) {
    
    const UserEvent = sequelize.define('UserEvent', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        EventId: DataTypes.BIGINT,
        UserId: DataTypes.BIGINT,
        status: {
            type: DataTypes.STRING,
            defaultValue: "I"
        }
    });

    UserEvent.associate = function(model) {
        UserEvent.belongsTo(model.Event);
        UserEvent.belongsTo(model.User);
    }

    return UserEvent;
}