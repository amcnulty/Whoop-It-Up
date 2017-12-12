module.exports = function(sequelize, DataTypes) {
    var Users = sequelize.define("Users", {
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
    	fullname: {
    	    type: DataTypes.STRING,
      		allowNull: false,
      		validate: {
        	len: [1]
	    	}
    	},
    	email: {
    	    type: DataTypes.STRING,
    	    primaryKey: true,
      		allowNull: false,
      		validate: {
        	len: [1]
	    	}
    	},
    	avatar: {
    	    type: DataTypes.STRING,
      		allowNull: true
    	},
    	signupdate: {
    		type: DataTypes.DATE
    	},
    	lastchgdate: {
    		type: DataTypes.DATE
    	}

     });

    Users.associate = function(model) {
        Users.belongsToMany(model.Events, {
            through: "UserEvent"
        });
    }

    return Users;
}