const connection = require('../db/db.js');

// This will get the boolean from database whether a 24 hour notification has been sent
const getHourNotification = function (rideID) {
    return new Promise((resolve, reject) => {
        const queryString = `SELECT hourNotification FROM pickups WHERE id = ${rideID};`
        connection.query(queryString, (err, res) => {
            if (err) {
                reject (err);
            } else {
                resolve(res);
            }
        })
    })
}

module.exports = { getHourNotification };