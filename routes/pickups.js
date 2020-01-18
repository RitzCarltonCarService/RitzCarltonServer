const db = require('../db/db_interactions');
const router = require('express').Router();
const helpers = require('./helpers');

router.post("/api/createPickup", (req, res) => {
    db.pickups.createPickup(helpers.addQuotes(req.body.to), helpers.addQuotes(req.body.from), helpers.addQuotes(req.body.userId), req.body.hotelId, req.body.rideShare, req.body.numBags, req.body.numPassengers, helpers.addQuotes(req.body.startTime))
    .then((val) => {
        res.send(val)
    })
    .catch((err) => {
        res.send(err);
    })
})

module.exports = router;