const { validatePickup } = require('./GoogleMapRequests');
const { getCarLocation } = require('./carData');

const findSpaceForPickup = function (pickupData, availability) {
    return new Promise((resolve, reject) => {

        //sort the pickups in the availability by startTime
        availability.pickups.sort((a, b) => b.startTime - a.startTime)

        //initialize previousNode as the beginning of the availability

        let previousNode = {
            endLat: availability.availability.lat,
            endLng: availability.availability.lng,
            estimatedEndTime: availability.availability.startTime
        };

        //if there is no specified start time, reassign previousNode to current time and car location
        if (!pickupData.startTime) {
            let carLocation = getCarLocation(availability.availability.carId);
            previousNode.endLat = carLocation.lat,
            previousNode.endLng = carLocation.lng,
            previousNode.estimatedEndTime = new Date();

            if (availability.pickups.length > 0) {
                nextNode = availability.pickups[0];
            }
        }

        //initialize nextNode as the end of the availability
        let nextNode = {
            startLat: availability.availability.lat,
            startLng: availability.availability.lng,
            estimatedStartTime: availability.availability.endTime
        };

        //if scheduled, find the nodes directly before and after the new pickup node by startTime
        if (pickupData.startTime) {

            for (let i = 0; i < availability.pickups.length; i++) {

                //if this is the last pickup, set it to previousNode by default
                if (i === availability.pickups.length - 1) {
                    previousNode = availability.pickups[i];
                }

                //if this pickup is after the requested time, set it to nextNode
                //and set the previous pickup to previousNode
                if (availability.pickups[i].estimatedStartTime > new Date(pickupData.startTime)) {
                    nextNode = availability.pickups[i];
                    if (i > 0) {
                        previousNode = availability.pickups[i - 1];
                    }
                    i = availability.pickups.length;
                }
            }
        }

        validatePickup(previousNode, nextNode, pickupData, (!pickupData.startTime))
        .then(data => {
            resolve(data);
        })
        .catch(err => {
            console.log(err);
            reject(err);
        })

    })
}

module.exports = { findSpaceForPickup };