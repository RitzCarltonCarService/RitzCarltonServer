const db = require('../db/db_interactions');
const router = require('express').Router();
const helpers = require('./helpers');

router.post('/api/addShift', (req, res) => {
    db.availabilities.addShift(req.body.driverId, req.body.carId, req.body.hotelId, helpers.addQuotes(req.body.startTime), helpers.addQuotes(req.body.endTime))
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
    db.availabilities.getShifts(req.query.driverId)
    .then((val) => {
        res.send(val);
    })
    .catch(err => {
        res.send(err);
    })
})

module.exports = router;