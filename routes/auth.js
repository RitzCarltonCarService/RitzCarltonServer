const db = require('../db/db_interactions');
const router = require('express').Router();
const helpers = require('./helpers');

router.post('/api/signup', (req, res) => {
    console.log(req.body);
    db.auth.signup(helpers.addQuotes(req.body.id), helpers.addQuotes(req.body.type), req.body.hotelId, helpers.addQuotes(req.body.name), helpers.addQuotes(req.body.email), helpers.addQuotes(req.body.phoneNumber))
    .then((val) => {
        res.send(val);
    })
    .catch(err => {
        res.send(err);
    })
})

router.get("/api/login", (req, res) => {
    console.log(req.query);
    db.auth.login(helpers.addQuotes(req.query.id))
    .then((val) => {
        let userInfo = {
            id: req.query.id,
            displayName: val[0].name,
            email: val[0].email,
            hotelId: val[0].hotelId,
            type: val[0].type,
            phoneNumber: val[0].phoneNumber,
            pickups: []
        };
        if (val[0].id) {
            for (let i = 0; i < val.length; i++) {
                userInfo.pickups.push({
                    id: val[i].id,
                    availabilityId: val[i].availabilityId,
                    startAddress: val[i].startAddress,
                    startLat: val[i].startLat,
                    startLng: val[i].startLng,
                    endAddress: val[i].endAddress,
                    endLat: val[i].endLat,
                    endLng: val[i].endLng,
                    estimatedStartTime: val[i].estimatedStartTime,
                    specifiedStartTime: val[i].specifiedStartTime,
                    rideShare: val[i].rideShare,
                    completed: val[i].completed,
                    estimatedEndTime: val[i].estimatedEndTime
                })
            }
        }
        res.send(userInfo);
    })
    .catch((err) => {
        res.send(err);
    })
})

router.post("/api/setName", (req, res) => {
    db.auth.setName(helpers.addQuotes(req.body.id), helpers.addQuotes(req.body.name))
    .then((val) => {
        res.send(val)
    })
    .catch((err) => {
        res.send(err)
    })
})

router.post("/api/setEmail", (req, res) => {
    db.auth.setEmail(helpers.addQuotes(req.body.id), helpers.addQuotes(req.body.email))
    .then((val) => {
        res.send(val)
    })
    .catch((err) => {
        res.send(err)
    })
})

router.post("/api/setPhoneNumber", (req, res) => {
    db.auth.setPhoneNumber(helpers.addQuotes(req.body.id), helpers.addQuotes(req.body.phoneNumber))
    .then((val) => {
        res.send(val)
    })
    .catch((err) => {
        res.send(err)
    })
})

router.post("/api/setHotel", (req, res) => {
    db.auth.setHotel(helpers.addQuotes(req.body.id), req.body.hotelId)
    .then((val) => {
        res.send(val)
    })
    .catch((err) => {
        res.send(err)
    })
})

router.post("/api/deleteUser", (req, res) => {
    db.auth.deleteUser(helpers.addQuotes(req.body.id))
    .then((val) => {
        res.send(val)
    })
    .catch((err) => {
        res.send(err)
    })
})

module.exports = router;