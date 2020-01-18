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

module.exports = router;