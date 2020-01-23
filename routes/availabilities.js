const db = require('../db/db_interactions');
const scheduleRide = require('../schedulingLogic/scheduleRide');
const router = require('express').Router();
const helpers = require('./helpers');

router.post('/api/newPickup', (req, res) => {
    console.log(req.body);
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
        res.send(val);
    })
    .catch(err => {
        res.send(err);
    })
})

module.exports = router;