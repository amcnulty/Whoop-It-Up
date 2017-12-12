	module.exports = function(sequelize, DataTypes) {
    var Categories = sequelize.define("Categories", {
    	categoryname: {
    	    type: DataTypes.STRING,
      		allowNull: false,
      		validate: {
        	len: [1]
	    	}
    	}
    });


    Categories.associate = function(models) {
        Categories.belongsToMany(models.Events, {
            through: "EventCategory"
        });
    }

    return Categories;
}