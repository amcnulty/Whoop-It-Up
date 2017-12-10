module.exports = function(sequelize, DataTypes) {
    var Users = sequelize.define("Users", {
        // columns go here
    });

    return Users;
}