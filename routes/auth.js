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
    db.auth.login(helpers.addQuotes(req.query.id))
    .then((val) => {
        res.send(val)
    })
    .catch((err) => {
        res.send(err)
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

module.exports = router;