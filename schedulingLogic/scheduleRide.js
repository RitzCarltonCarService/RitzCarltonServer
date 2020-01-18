const { schedulingHelpers : { retrieveAvailabilities, findPickupsForAvailability } } = require('../db/db_interactions');
const { findSpaceForPickup } = require('./findSpaceForPickup');
const { asyncForEach } = require('./helper');
const { addPickup } = require('../db/db_interactions/addPickup');

const scheduleRide = function (pickupData, cb) {

    retrieveAvailabilities(pickupData.hotelId, pickupData.startTime)
    .then(availabilities => {
        return Promise.all(
            availabilities.map(
                availability => findPickupsForAvailability(availability)
            )
        );
    })
    .then((availabilities) => {    
        availabilities.sort( (a, b) => b.pickups.length - a.pickups.length );
        asyncForEach(availabilities, availability => {
            findSpaceForPickup(pickupData, availability)
            .then((data) => {
                if (!data) {
                    resolve("All cars are busy at this time!")
                } else {
                    return addPickup({
                        passengerId: pickupData.passengerId,
                        availabilityId: availability.availability.id,
                        startAddress: pickupData.startAddress,
                        startLat: pickupData.startLat,
                        startLng: pickupData.startLng,
                        endAddress: pickupData.endAddress,
                        endLat: pickupData.endLat,
                        endLng: pickupData.endLng,
                        estimatedStartTime: pickupData.startTime,
                        specifiedStartTime: pickupData.startTime,
                        rideShare: null,
                        completed: false,
                        estimatedEndTime: data.estimatedEndTime
                    })
                }
            })
            .then(data => {
                cb("Pickup added!")
            })
            .catch(err => {
                cb(err);
            })
        })
    })
    .catch (err => cb(err));
}

module.exports = scheduleRide