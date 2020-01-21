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
        if (availabilities.length === 0) {
            cb("There are no drivers working at that time");
            return;
        }
        console.log("Found " + availabilities.length + " availabilities");
        availabilities.sort( (a, b) => b.pickups.length - a.pickups.length );
        asyncForEach(availabilities, availability => {
            findSpaceForPickup(pickupData, availability)
            .then((data) => {
                if (!data) {
                    resolve("All cars are busy at this time!")
                } else {
                    const estimatedEndTime = new Date(data.estimatedEndTime).toString();
                    console.log(estimatedEndTime);
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
                        estimatedEndTime: "2020-01-20 12:12:12"
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