const db = require('../db/db_interactions');
const scheduleRide = require('../schedulingLogic/scheduleRide');
const router = require('express').Router();
const helpers = require('./helpers');

// Mail Jet API keys
const API_KEY = '6fb7d99c6ae7057faeff502fc8822db9';
const API_SECRET = '5d09c2410947c804a36c98b1e7c8d63c';
const mailjet = require('node-mailjet').connect(API_KEY, API_SECRET);

router.post('/api/newPickup', (req, res) => {
    let rideData = req.body.pickupData; 

    scheduleRide(req.body.pickupData, (err, data) => {
        if (err) {
            console.log("This is the error: ", err)
            res.send(err);
        } else {
            if (data = "Pickup added!") {
                console.log("Inside of else statement")
                // Sending Transaction email with details of ride request
                const request = mailjet
                    .post("send", {'version': 'v3.1'})
                    .request({
                        "Messages":[
                            {
                                "From": {
                                    "Email": "jonathan.keane@galvanize.com",
                                    "Name": "The Ritz-Carlton Residences"
                                },
                                "To": [
                                    {
                                        "Email": rideData.email,
                                        "Name": rideData.name
                                    }
                                ],
                                "TemplateID": 1208028,
                                "TemplateLanguage": true,
                                "Subject": "* Ritz-Carlton Residences: Confirmation Ride Request Information - Thank you!",
                                "Variables": {
                                        "TripDate": rideData.date,
                                        "TripTime": rideData.startHoursMins,
                                        "ArrivalTime": rideData.expectedArrivalTime,
                                        "PickUpLocation": rideData.startAddress,
                                        "DropOffLocation": rideData.endAddress,
                                        "LuggageAmount": rideData.luggage,
                                        "TotalTravelerAmount": rideData.travelers,
                                        "RideShareBoolean": rideData.rideShare ? "Yes" : "No",
                                        "appURL": "https://www.ritzcarlton.com/en/residences"
                                    }
                                }
                            ]
                        })
                    request
                    .then((result) => {
                        res.send(data);
                    })
                    .catch((err) => {
                        console.log(err.statusCode)
                    })    
            }
        }
    })
})

module.exports = router;