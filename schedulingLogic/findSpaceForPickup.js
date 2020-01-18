const { validatePickup } = require('./GoogleMapRequests');

const findSpaceForPickup = function (pickupData, availability) {
    return new Promise((resolve, reject) => {

        //sort the pickups in the availability by startTime
        availability.pickups.sort((a, b) => b.startTime - a.startTime)

        //initialize previousNode the beginning of the availability
        let previousNode = {
            endLat: availability.availability.lat,
            endLng: availability.availability.lng,
            estimatedEndTime: availability.availability.startTime
        };

        //initialize nextNode as the end of the availability
        let nextNode = {
            startLat: availability.availability.lat,
            startLng: availability.availability.lng,
            estimatedStartTime: availability.availability.endTime
        };

        //find the nodes directly before and after the new pickup node by startTime
        for (let i = 0; i < availability.pickups.length; i++) {
            if (availability.pickups[i].startTime > pickupData.startTime) {
                nextNode = availability.pickups[i];
                if (i > 0) {
                    previousNode = availability.pickups[i]
                }
                break;
            }
            if (i === availability.pickups.length - 1) {
                if (i > 0) {
                    previousNode = availability.pickups[i];
                }
            }

        }

        validatePickup(previousNode, nextNode, pickupData)
        .then(data => {
            resolve(data);
        })
        .catch(err => {
            reject(err);
        })

    })
}

module.exports = { findSpaceForPickup };