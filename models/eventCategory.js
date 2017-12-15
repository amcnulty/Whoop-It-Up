module.exports = function(sequelize, DataTypes) {
    
    const EventCategory = sequelize.define('EventCategory', {
        EventId: DataTypes.BIGINT,
        CategoryId: DataTypes.BIGINT
    });

    EventCategory.associate = function(model) {
        EventCategory.belongsTo(model.Event);
        EventCategory.belongsTo(model.Category);
    }

    return EventCategory;
}