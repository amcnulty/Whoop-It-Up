/**
 * Category Model
 * --------------
 * 
 * The Category model defines the categories table to hold the categories for events.
 * 
 * Dependency injection for the Category model in sequelize.
 * @param {Object} sequelize - Instance of sequelize class
 * @param {Object} DataTypes - Sequelize data types
 */
module.exports = function(sequelize, DataTypes) {
    var Category = sequelize.define('Category', {
    	categoryname: {
    	    type: DataTypes.STRING,
      		allowNull: false,
      		validate: {
        	    len: [1]
	    	}
    	}
    });
    /**
     * Create a many to many association with the events table.
     * @param {Object} models - The models included in this sequelize instance
     */
    Category.associate = function(models) {
        Category.belongsToMany(models.Event, {
            through: 'EventCategories',
            as: 'categories'
        });
    }

    return Category;
}