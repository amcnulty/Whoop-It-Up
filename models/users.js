module.exports = function(sequelize, DataTypes) {
    var Users = sequelize.define("Users", {
        // columns go here
    });

    Users.associate = function(model) {
        Users.belongsToMany(model.Events, {
            through: "UserEvent"
        });
    }

    return Users;
}