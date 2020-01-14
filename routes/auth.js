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

module.exports = router;