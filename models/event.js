module.exports = function(sequelize, DataTypes) {
    var Event = sequelize.define('Event', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            len: [1]
            }
        },
        description: {
            type: DataTypes.TEXT
        },
        host: {
            type: DataTypes.STRING,
        },
        hostId :{
            type: DataTypes.BIGINT,
        },
        isPrivate: {
            type: DataTypes.BOOLEAN,
        },        
        date: {
            type: DataTypes.STRING,
        },
        time: {
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