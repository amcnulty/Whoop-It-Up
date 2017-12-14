module.exports = function(sequelize, DataTypes) {
    var Event = sequelize.define("Event", {
        eventName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            len: [1]
            }
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
        },        
        eventDate: {
            type: DataTypes.STRING,
        },
        eventTime: {
            type: DataTypes.STRING,
        },
        location: {
            type: DataTypes.STRING,
        }
    });

    Event.associate = function(model) {
        Event.belongsToMany(model.Category, {
            through: "EventCategory",
            as: 'categories',
            foreignKey: 'eventId'
        });

        Event.belongsToMany(model.User, {
            through: "UserEvent"
        });
    }

    return Event;
}