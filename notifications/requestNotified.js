const connection = require('../db/db.js');

// This will set the notification in the database to TRUE for a particular ride
const requestNotified = function (type, rideID) {
    let requestQuery = null;
    
    if (type === "hr") {
        requestQuery = `UPDATE pickups SET hourNotification=true WHERE id="${rideID}";`
    } else if (type === "min") {
        requestQuery = `UPDATE pickups SET minNotification=true WHERE id="${rideID}";`
    }

    return new Promise((resolve, reject) => {
        const queryString = requestQuery;
        connection.query(queryString, (err, res) => {
            if (err) {
                reject (err);
            } else {
                resolve(res);
            }
        })
    })
}

module.exports = { requestNotified };