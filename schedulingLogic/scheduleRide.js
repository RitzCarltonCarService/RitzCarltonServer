const { schedulingHelpers : { retrieveAvailabilities, findPickupsForAvailability } } = require('../db/db_interactions');
const { findSpaceForPickup } = require('./findSpaceForPickup');
const { updateRetrieveNewInfo } = require('./carData');
const { asyncForEach, convertDateForMYSQL } = require('./helper');
const { addPickup } = require('../db/db_interactions/addPickup');

const scheduleRide = function (pickupData, cb) {

    let chosenCar = null;

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
            cb(null, "There are no drivers working at that time");
            return;
        }

        console.log("Found " + availabilities.length + " availabilities");

        //Sort availabilities by number of pickups
        availabilities.sort( (a, b) => a.pickups.length - b.pickups.length );

        console.log("AVAILABILITIES: " + JSON.stringify(availabilities));

        //Look for space in each availability, starting with the one with fewest pickups
        return asyncForEach(availabilities, availability => {
            console.log ("AVAILABILITY: " + JSON.stringify(availability));
            return findSpaceForPickup(pickupData, availability)
            .then((data) => {
                console.log("DATA IS " + data);
                if (data) {
                    chosenCar = availability.availability.carId;
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
                        hourNotification: false,
                        minNotification: false,
                        completed: false,
                        estimatedEndTime: convertDateForMYSQL(new Date(data.estimatedEndTime))
                    })
                }
            })
            //.then((data) => data);
        })
    })
    .then(data => {
        if (data) {
            console.log("chosenCar " + chosenCar);
            updateRetrieveNewInfo(chosenCar, true);
            cb(null, "Pickup added!");
        } else cb(null, "All drivers are busy at this time.")
    })
    .catch (err => cb(err, null));
}

module.exports = scheduleRide