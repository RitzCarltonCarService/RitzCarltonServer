const db = require('../db/db_interactions');
const scheduleRide = require('../schedulingLogic/scheduleRide');
const router = require('express').Router();
const helpers = require('./helpers');

router.post('/api/newPickup', (req, res) => {
    scheduleRide(req.body.pickupData, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
})

router.post('/api/addShift', (req, res) => {
    db.availabilities.addShift(helpers.addQuotes(req.body.driverId), req.body.carId, req.body.hotelId, helpers.addQuotes(req.body.startTime), helpers.addQuotes(req.body.endTime))
    .then((val) => {
        res.send(val);
    })
    .catch(err => {
        res.send(err);
    })
})

router.post('/api/deleteShift', (req, res) => {
    db.availabilities.deleteShift(req.body.id)
    .then((val) => {
        res.send(val);
    })
    .catch(err => {
        res.send(err);
    })
})

router.get('/api/getShifts', (req, res) => {
    db.availabilities.getShifts(helpers.addQuotes(req.query.driverId))
    .then((val) => {
        val = formatShifts(val);
        res.send(val);
    })
    .catch(err => {
        res.send(err);
    })
})


const formatShifts = data => {
    let output = [];
    let idStorage = {};
    let currentAvailability = null;
    for (let i = 0; i < data.length; i++) {
        if (!idStorage[data[i].aid]) {
            currentAvailability = {
                id: data[i].aid,
                driverId: data[i].driverId,
                hotelId: data[i].hotelId,
                carId: data[i].carId,
                startTime: data[i].startTime,
                endTime: data[i].endTime,
                pickups: []
            };
            output.push(currentAvailability);
            idStorage[data[i].aid] = true;
        }

        currentAvailability.pickups.push({
            id: data[i].id,
            availabilityId: data[i].availabilityId,
            passengerId: data[i].passengerId,
            completed: data[i].completed,
            startAddress: data[i].startAddress,
            startLat: data[i].startLat,
            startLng: data[i].startLng,
            endAddress: data[i].endAddress,
            endLat: data[i].endLat,
            endLng: data[i].endLng,
            estimatedStartTime: data[i].estimatedStartTime,
            specifiedStartTime: data[i].specifiedStartTime,
            rideShare: data[i].rideShare,
            estimatedEndTime: data[i].estimatedEndtime
        })
    }
    return output;
}

module.exports = router;