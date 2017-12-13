const bcrypt = require('bcrypt');
const SALT = 10;

const passwordHandler = {
    /**
     * This method takes a plain text password string and hashes it using bcrypt.
     * The hashed string is returned.
     * @param {String} password - The password to be hashed
     * @returns {String}
     */
    hashPassword(password, cb) {
        bcrypt.genSalt(SALT, function(err, salt) {
            if (err) throw err;
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) throw err;
                cb(hash);
            });
        });
    },
    comparePassword() {

    }
}

module.exports = passwordHandler;