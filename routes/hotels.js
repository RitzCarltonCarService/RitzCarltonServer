const db = require('../db/db_interactions');
const router = require('express').Router();
const helpers = require('./helpers');

router.get("/api/getHotels", (req, res) => {
    db.hotels.getHotels()
    .then((val) => {
        res.send(val);
    })
    .catch((err) => {
        res.send(err)
    })
})


module.exports = router;