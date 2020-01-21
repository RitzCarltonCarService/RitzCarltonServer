const connection = require('../db');


//createPickup query still needs work- not functional yet
const createPickup = function (to, from, userId, hotelId, rideShare, numBags, numPassengers, startTime) {
    return new Promise((resolve, reject) => {
        //how do we get lat/long from address?
        //shouldn't pickups table have a bags field?
        const queryString = "INSERT INTO pickups (passengerId, startAddress, endAdress, specefiedStartTime, rideShare) VALUES (" + [userId, to, from, starTime].join(", ") + ", " + [rideShare] + ")";
        console.log("str = ", queryString) 
        connection.query(queryString, (err) => {
            if (err) {
                reject (err);
            } else {
                resolve("success");
            }
        })
    })
}

const deletePickup = function (id) {
    return new Promise((resolve, reject) => {
        const queryString = "DELETE FROM pickups WHERE id = "  + [id] ; //TODO: make sure this query also removes its id from any other pickup that has it as a ride share.
        connection.query(queryString, (err) => {
            if (err) {
                reject (err);
            } else {
                resolve("success");
            }
        })
    })
}

module.exports = { createPickup, deletePickup }