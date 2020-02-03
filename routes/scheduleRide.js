const db = require('../db/db_interactions');
const scheduleRide = require('../schedulingLogic/scheduleRide');
const router = require('express').Router();
const helpers = require('./helpers');
const dotenv = require('dotenv');

// Mail Jet API keys
const MJ_API_KEY = process.env.MJ_API_KEY;
const MJ_API_SECRET = process.env.MJ_API_SECRET;
const mailjet = require('node-mailjet').connect(MJ_API_KEY, MJ_API_SECRET);

router.post('/api/newPickup', (req, res) => {
    let rideData = req.body.pickupData; 

    scheduleRide(req.body.pickupData, (err, data) => {
        if (err) {
            console.log("Sending error: " + err);
            res.send(err);
        } else {
            if (data === "Pickup added!") {
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
                        console.log("Sent email");
                        console.log("resolving with " + data);
                        res.send(data);
                    })
                    .catch((err) => {
                        console.log(err.statusCode)
                        console.log("Sending error: " + err)
                        res.send(err);
                    })    
            } else {
                console.log("No email");
                console.log("Resolving with " + data);
                res.send(data);
            }
        }
    })
})

module.exports = router;