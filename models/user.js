/**
 * User Model
 * ----------
 * 
 * The User model defines the users table for holding user records.
 * 
 * Dependency injection for the Event model in sequelize.
 * @param {Object} sequelize - Instance of sequelize class
 * @param {Object} DataTypes - Sequelize data types
 */
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
    	username: {
    	    type: DataTypes.STRING,
      		allowNull: false,
      		validate: {
        	len: [1]
	    	}
    	},
    	password: {
    	    type: DataTypes.STRING,
      		allowNull: false,
      		validate: {
        	len: [1]
	    	}
    	},
    	email: {
    	    type: DataTypes.STRING,
    	    unique: true,
      		allowNull: false,
      		validate: {
        	len: [1]
	    	}
    	},
    	avatar: {
    	    type: DataTypes.INTEGER,
      		allowNull: true
    	}
     });
	/**
	 * Creates a many to many association with the events table.
	 * @param {Object} model - The models included in this sequelize instance
	 */
    User.associate = function(model) {
        User.belongsToMany(model.Event, {
			through: 'UserEvents',
			as: 'userEvents'
        });
    }

    return User;
}