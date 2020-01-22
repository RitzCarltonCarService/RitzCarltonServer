const connection = require('../db');

const addShift = function ( driverId, carId, hotelId, startTime, endTime) {
    return new Promise((resolve, reject) => {
        const queryString = "INSERT INTO availabilities (driverId, carId, hotelId, startTime, endTime) VALUES ("  + [driverId, carId, hotelId, startTime, endTime].join(", ") + ")";
        connection.query(queryString, (err) => {
            if (err) {
                reject (err);
            } else {
                resolve("success");
            }
        })
    })
}

const deleteShift = function ( id ) {
    return new Promise((resolve, reject) => {
        const queryString = "DELETE FROM availabilities WHERE id = " + [id]; //TODO: SET availabilityId in pickups table as a FK referencing availabilty table's id column.  Then set"delete_rule = 'CASCADE'" which will cause this deletion operation on availabilities to also delete all pickups with matching availabilityId.
        connection.query(queryString, (err) => {
            if (err) {
                reject (err);
            } else {
                resolve("success");
            }
        })
    })
}

const getShifts = function ( driverId ) {
    return new Promise((resolve, reject) => {
        const queryString = "SELECT * FROM availabilities LEFT JOIN pickups ON availabilities.id = pickups.availabilityId WHERE availabilities.driverId = " + [driverId];
        connection.query(queryString, (err, res) => {
            if (err) {
                reject (err);
            } else {
                resolve(res);
            }
        })
    })
}

module.exports = { addShift, deleteShift, getShifts }