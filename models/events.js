module.exports = function(sequelize, DataTypes) {
    var Events = sequelize.define("Events", {
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
            type: DataTypes.DATEONLY,
        },
        eventTime: {
            type: DataTypes.TIME,
        },
        location: {
            type: DataTypes.STRING,
        },
        categoryID: {
            type: DataTypes.INTEGER
        }


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