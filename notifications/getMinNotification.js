const connection = require('../db/db.js');

// This will get the boolean from database whether a 60 minute notification has been sent
const getMinNotification = function (rideID) {
    return new Promise((resolve, reject) => {
        const queryString = `SELECT minNotification FROM pickups WHERE id = ${rideID};`
        connection.query(queryString, (err, res) => {
            if (err) {
                reject (err);
            } else {
                resolve(res);
            }
        })
    })
}

module.exports = { getMinNotification };