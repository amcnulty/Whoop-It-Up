/**
 * Event Model
 * -----------
 * 
 * The Event model defines the events table to hold event records.
 * 
 * Dependency injection for the Event model in sequelize.
 * @param {Object} sequelize - Instance of sequelize class
 * @param {Object} DataTypes - Sequelize data types
 */
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
        },
        placeId: {
            type: DataTypes.STRING,
        },
        latLng: {
            type: DataTypes.STRING,
        },
        formattedAddr: {
            type: DataTypes.STRING,
        }
    });
    /**
     * Create a many to many association with the categories table and the users table.
     * @param {Object} model - The models included in this sequelize instance
     */
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