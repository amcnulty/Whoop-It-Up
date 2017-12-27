/**
 * EventCategory Model
 * -------------------
 * 
 * The EventCategory model defines the eventCategories join table
 * joining the events table and categories table.
 * 
 * Dependency injection for the Event model in sequelize.
 * @param {Object} sequelize - Instance of sequelize class
 * @param {Object} DataTypes - Sequelize data types
 */
module.exports = function(sequelize, DataTypes) {
    const EventCategory = sequelize.define('EventCategory', {
        EventId: DataTypes.BIGINT,
        CategoryId: DataTypes.BIGINT
    });
    /**
     * Creates a one to one association with the events table and the categories table.
     * @param {Object} model - The models included in this sequelize instance
     */
    EventCategory.associate = function(model) {
        EventCategory.belongsTo(model.Event);
        EventCategory.belongsTo(model.Category);
    }

    return EventCategory;
}