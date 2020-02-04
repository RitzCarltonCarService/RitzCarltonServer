const connection = require('../db/db.js');

// Get user's Expo token from the database
const getExpoToken = function (userID) {
    return new Promise((resolve, reject) => {
        const queryString = `SELECT token FROM users WHERE id="${userID}";`
        connection.query(queryString, (err, res) => {
            if (err) {
                reject (err);
            } else {
                resolve(res);
            }
        })
    })
}

module.exports = { getExpoToken };