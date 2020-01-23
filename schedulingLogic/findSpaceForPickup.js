const { validatePickup } = require('./GoogleMapRequests');
const { getCarLocation } = require('./carData');

const findSpaceForPickup = function (pickupData, availability) {
    return new Promise((resolve, reject) => {

        console.log("PICKUPS: " + JSON.stringify(availability.pickups));

        //sort the pickups in the availability by startTime
        // availability.pickups.sort((a, b) => b.startTime - a.startTime)

        //access car location data

        carLocation = getCarLocation(availability.availability.carId);

        //initialize previousNode as the beginning of the availability
        let previousNode = {
            endLat: availability.availability.lat,
            endLng: availability.availability.lng,
            estimatedEndTime: availability.availability.startTime
        };

        //if there is no specified start time, reassign previousNode to current time and car location
        if (!pickupData.startTime) {
            previousNode.endLat = carLocation.lat,
            previousNode.endLng = carLocation.lng,
            previousNode.estimatedEndTime = new Date();
        }

        //initialize nextNode as the end of the availability
        let nextNode = {
            startLat: availability.availability.lat,
            startLng: availability.availability.lng,
            estimatedStartTime: availability.availability.endTime
        };

        //find the nodes directly before and after the new pickup node by startTime
        for (let i = 0; i < availability.pickups.length; i++) {
            console.log("iterating through " + i + " pickups");
            console.log("current: " + availability.pickups[i].startTime);
            console.log("expected: " + availability.pickups[i].estimatedStartTime);

            //check to see if car is currently in the middle of a pickup
            if (availability.pickups[i].estimatedStartTime <= new Date() && availability.pickups[i].estimatedEndTime >= new Date()) {
                resolve(null);
                return;
            }

            //set nextNode and previousNode if proper spot is found
            if (pickupData.startTime && availability.pickups[i].startTime > pickupData.estimatedStartTime) {
                nextNode = availability.pickups[i];
                if (i > 0) {
                    previousNode = availability.pickups[i]
                }
                break;
            }
            if (i === availability.pickups.length - 1) {
                previousNode = availability.pickups[i];
            }

        }

        console.log("TIMES: " + previousNode.estimatedEndTime + " " + nextNode.estimatedStartTime)

        validatePickup(previousNode, nextNode, pickupData, (!pickupData.startTime))
        .then(data => {
            console.log("resolving in .then")
            console.log(data);
            resolve(data);
        })
        .catch(err => {
            console.log("resolving in .catch")
            console.log(err);
            reject(err);
        })

    })
}

module.exports = { findSpaceForPickup };