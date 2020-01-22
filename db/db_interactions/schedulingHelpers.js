const connection = require('../db');


//retrieves availabilities by hotel and time with hotel location attached
const retrieveAvailabilities = function(hotelId, time) {
    return new Promise((resolve, reject) => {
        const queryString = `SELECT *, hotels.* FROM availabilities ` +
            `INNER JOIN hotels ON availabilities.hotelId=hotels.id ` +
            `WHERE hotelId=${hotelId} ` +
            `AND startTime<"${time}" ` +
            `AND endTime>"${time};"`;
        connection.query(queryString, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve (data);
            }
        })
    });
}

//retrieves pickups associated with an availability and returns them both in an object
const findPickupsForAvailability = function (availability) {
    return new Promise ((resolve, reject) => {
        const queryString = `SELECT * FROM pickups WHERE availabilityId=${availability.id} ORDER BY estimatedStartTime;`;
        connection.query(queryString, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log("got from database " + data);
                resolve ({availability: availability, pickups: data});
            }
        })
    })
}

module.exports = { retrieveAvailabilities, findPickupsForAvailability }