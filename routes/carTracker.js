const router = require('express').Router();
const carData = require('../schedulingLogic/carData');

router.post('/api/car', (req, res) => {
    carData.updateCarLocation(req.body.id, req.body.lat, req.body.lng);
    
    if (carData.getNewInfo (req.body.id)) {
        carData.updateRetrieveNewInfo(req.body.id);
        res.send("New info");
    } else {
        res.send("No new info");
    }
})

module.exports = router;