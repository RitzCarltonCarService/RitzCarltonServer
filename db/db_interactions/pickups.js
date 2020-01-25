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

const getPickups = function (id) {
    return new Promise((resolve, reject) => {
        const queryString = "SELECT pickups.id AS pickupId, pickups.passengerId, pickups.completed, pickups.startAddress, pickups.startLat, pickups.startLng, pickups.endAddress, pickups.endAddress, pickups.endLat, pickups.endLng, pickups.estimatedStartTime, pickups.specifiedStartTime, pickups.rideShare, pickups.estimatedEndTime, cars.id AS carId, cars.type AS carType, users.name AS driverName, users.phoneNumber AS driverPhoneNumber FROM pickups INNER JOIN availabilities ON pickups.availabilityId = availabilities.id INNER JOIN users ON availabilities.driverId = users.id INNER JOIN cars ON availabilities.carId = cars.id WHERE pickups.passengerId = " + [id];
        connection.query(queryString, (err, res) => {
            if (err) {
                reject (err);
            } else {
                resolve(res);
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

module.exports = { createPickup, deletePickup, getPickups }