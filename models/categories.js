module.exports = function(sequelize, DataTypes) {
    var Categories = sequelize.define("Categories", {
        // columns go here
    });

    Categories.associate = function(models) {
        Categories.belongsToMany(models.Events, {
            through: "EventCategory"
        });
    }

    return Categories;
}