const connection = require('../db');

const addPickup = function(pickup) {
    return new Promise((resolve, reject) => {
        const queryString = `INSERT INTO pickups ` +
        `(passengerId, availabilityId, startAddress, startLat, startLng, endAddress, endLat, endLng, estimatedStartTime, specifiedStartTime, rideShare, completed, estimatedEndTime) ` +
        `VALUES ('${pickup.passengerId}', ${pickup.availabilityId}, '${pickup.startAddress}', ${pickup.startLat}, ${pickup.startLng}, '${pickup.endAddress}', ${pickup.endLat}, ${pickup.endLng}, '${pickup.estimatedStartTime}', '${pickup.specifiedStartTime}', ${pickup.rideShare}, ${pickup.completed}, '${pickup.estimatedEndTime}');`;
        connection.query(queryString, err => {
            if (err) {
                reject(err);
            } else {
                console.log("true");
                resolve(pickup.availabilityId);
            }
        })
    })
}

module.exports = { addPickup };