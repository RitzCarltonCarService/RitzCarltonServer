const db = require('../db/db_interactions');
const router = require('express').Router();

router.post('/api/addToken', (req, res) => {
    console.log(req.query);
    db.token.addToken(req.query.userID, req.query.token)
    .then((val) => {
        res.send(data);
    })
    .catch(err => {
        res.send(err);
    })
});

module.exports = router;