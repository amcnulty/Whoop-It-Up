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


    Category.associate = function(models) {
        Category.belongsToMany(models.Event, {
            through: 'EventCategories',
            as: 'categories'
        });
    }

    return Category;
}