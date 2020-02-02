const db = require('../db/db_interactions');
const router = require('express').Router();

router.post('/api/addToken', (req, res) => {
    console.log(req.body);
    db.addToken(req.body, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
});

module.exports = router;