module.exports = function(sequelize, DataTypes) {
    var Event = sequelize.define('Event', {
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
            through: 'EventCategories',
            as: 'categories'
        });

        Event.belongsToMany(model.User, {
            through: 'UserEvents',
            as: 'userEvents'
        });
    }

    return Event;
}