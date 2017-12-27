/**
 * Password Handler
 * ----------------
 * 
 * This file is used for doing operations with user passwords. Passwords need
 * to be hashed and hashed passwords need to be checked with plain text values.
 */
const bcrypt = require('bcrypt');
/** The salt work factor for hashing the password */
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
    /**
     * This method compares a plain text password string with the hashed password that
     * is stored in the database.
     * @param {String} plainText - Password to be compared
     * @param {String} hash - Hashed password in database
     * @param {Function} cb - Callback function that with boolean result as parameter
     */
    comparePassword(plainText, hash, cb) {
        bcrypt.compare(plainText, hash, function(err, res) {
            cb(res);
        });
    }
}

module.exports = passwordHandler;