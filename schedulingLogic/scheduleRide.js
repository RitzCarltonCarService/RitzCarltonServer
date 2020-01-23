const { schedulingHelpers : { retrieveAvailabilities, findPickupsForAvailability } } = require('../db/db_interactions');
const { findSpaceForPickup } = require('./findSpaceForPickup');
const { asyncForEach, convertDateForMYSQL } = require('./helper');
const { addPickup } = require('../db/db_interactions/addPickup');

const scheduleRide = function (pickupData, cb) {

    //Get availabilities at pickup start time
    retrieveAvailabilities(pickupData.hotelId, pickupData.startTime || convertDateForMYSQL(new Date()))
    .then(availabilities => {
        return Promise.all(
            availabilities.map(
                availability => findPickupsForAvailability(availability)
            )
        );
    })
    .then((availabilities) => {   

        //Return if there are no availabilities at this time
        if (availabilities.length === 0) {
            cb("There are no drivers working at that time");
            return;
        }

        console.log("Found " + availabilities.length + " availabilities");

        //Sort availabilities by number of pickups
        availabilities.sort( (a, b) => b.pickups.length - a.pickups.length );

        //Look for space in each availability, starting with the one with fewest pickups

        let hasPlaced = false;

        return asyncForEach(availabilities, availability => {
            return findSpaceForPickup(pickupData, availability)
            .then((data) => {
                console.log("DATA IS " + data);
                if (data) {
                    const estimatedEndTime = new Date(data.estimatedEndTime);
                    hasPlaced = true;
                    return addPickup({
                        passengerId: pickupData.passengerId,
                        availabilityId: availability.availability.id,
                        startAddress: pickupData.startAddress,
                        startLat: pickupData.startLat,
                        startLng: pickupData.startLng,
                        endAddress: pickupData.endAddress,
                        endLat: pickupData.endLat,
                        endLng: pickupData.endLng,
                        estimatedStartTime: convertDateForMYSQL(new Date(pickupData.startTime)),
                        specifiedStartTime: convertDateForMYSQL(new Date(pickupData.startTime)),
                        rideShare: null,
                        completed: false,
                        estimatedEndTime: convertDateForMYSQL(estimatedEndTime)
                    })
                }
            })
            .then((data) => data);
            // .catch(err => {
            //     cb(err);
            // })
        })
        // .catch(err => cb(err))
    })
    .then(data => {
        console.log("Should return " + data);
        if (data) cb("Pickup added!")
        else cb("All drivers are busy at this time.")
    })
    .catch (err => cb(err));
}

module.exports = scheduleRide