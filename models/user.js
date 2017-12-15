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

    User.associate = function(model) {
        User.belongsToMany(model.Event, {
			through: 'UserEvents',
			as: 'userEvents'
        });
    }

    return User;
}
