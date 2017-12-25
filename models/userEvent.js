/**
 * UserEvent Model
 * ---------------
 * 
 * The UserEvent model defines the userEvents join table
 * joining the users table and the events table.
 * 
 * Dependency injection for the Event model in sequelize.
 * @param {Object} sequelize - Instance of sequelize class
 * @param {Object} DataTypes - Sequelize data types
 */
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
    /**
     * Creates a one to one association with the events table and the users table.
     * @param {Object} model - The models included in this sequelize instance
     */
    UserEvent.associate = function(model) {
        UserEvent.belongsTo(model.Event);
        UserEvent.belongsTo(model.User);
    }

    return UserEvent;
}