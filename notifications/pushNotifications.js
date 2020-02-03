const { Expo } = require('expo-server-sdk')
const { getExpoToken } = require('./getExpoToken');
const { getHourNotification } = require('./getHourNotification');
const { getMinNotification } = require('./getMinNotification');
const { requestNotified } = require('./requestNotified');
const { convertMySQLDate } = require('./convertMySQLDate');
const connection = require('../db/db.js');
const moment = require('moment');
const axios = require('axios');

// Create a new Expo SDK client
let expo = new Expo();

// Getting all pick-up requests from database to be analyzed
const getRequests = () => {
    return new Promise((resolve, reject) => {
        const queryString = "SELECT * FROM pickups;"
        connection.query(queryString, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    })
}

// sendPushNotifications first checks the type of push notification to be sent (24 hour/60 minute)
//  if this is a 24 notification, sends a request
const sendPushNotification = async(type, data) => {
    let requestData = data;

    try {
        let response = null;

        // Check to see if the notification type is a 24 or 60 minute notification
        if (type === "hr") {
            response = await getHourNotification(requestData.id)
            response = response[0].hourNotification
        } else if (type === "min") {
            response = await getMinNotification(requestData.id)
            response = response[0].minNotification
        }
       
        // Get Expo token from database
        if (!response) {
           let tokenArr = await getExpoToken(requestData.passengerId);
           let token = tokenArr[0].token;

           if (!Expo.isExpoPushToken(token)) {
               return console.error(`Push token ${token} is not a valid Expo push token!`)
           }

           let date = moment(requestData.estimatedStartTime).format("LLL");

           // If type is 24hour notification type, send 24hour notification to user
           if (type === "hr") {
            axios({
                method: 'post',
                url: 'https://exp.host/--/api/v2/push/send',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                data: {
                        "to": token,
                        "sound": "default",
                        "title": `Ritz-Carlton: 24HR Notification for Tomorrow's Ride Request` ,
                        "body": `Reminder for your upcoming request!\nRequest-Date: ${date}\nDestination: ${requestData.endAddress}`
                    }
                })
                .then(response => {
                    requestNotified(type, requestData.id)
                        .then(response => {
                            console.log("Token added to database")
                            return;
                        })
                        .catch(error => {
                            console.log(error)
                        })
                })
                .catch(err => {
                    console.log(err)
                })
            }
                   
            // If type is 60min notification type, send 24hour notification to user
            if (type === "min") {
                axios({
                    method: 'post',
                    url: 'https://exp.host/--/api/v2/push/send',
                    headers: {
                        'Content-Type': 'application/json'
                    }, 
                    data: {
                            "to": token,
                            "sound": "default",
                            "title": "Ritz-Carlton: Your Ride Request is Today",
                            "body": `Your driver is picking you up in an hour!\nPick-up Location: ${requestData.startAddress}`
                        }
                })
                .then(response => {
                    requestNotified(type, requestData.id)
                        .then(response => {
                            console.log("Token added to database");
                            return;
                        })
                        .catch(error => {
                            console.log(error)
                        })
    
                })
                .catch(err => {
                    console.log(err)
                })
           }
        }   
       } catch(err) {
           console.log(err);
           console.log('Could not process request due to an error');
       }
}

// analyzeRequests iterates over pick-up request array, checks if there is a 24 hour difference between current date
//  and request Date or if there is a 60 minute difference between current time and request
//  If either is true, send Push notification
const analyzeRequests = (data) => {
    let today = new Date();

    for (let i = 0; i < data.length; i++) {
        // Convert returned mySQL date
        let requestDate = convertMySQLDate(data[i].estimatedStartTime);
        let diff = requestDate - today; // First get difference in milliseconds
        let diffHours = Math.floor(diff/1000/60/60); // difference in hours
        let diffMins = Math.floor(diff/1000/60); // difference in minutes

        if (diffHours === 24) {
            sendPushNotification("hr", data[i])
        } else if (diffMins >= 58 && diffMins <= 61) {
            sendPushNotification("min", data[i])
        } else {
            console.log("No notification necessary!")
        }
    }
}

const checkRequests = () => {
    getRequests()
        .then(response => {
            analyzeRequests(response)
        })
        .catch(error => {
            console.log("This is the error in getRequests: ", error)
        })
}; 
 
const checkPickUps = () => {
    setInterval(() => checkRequests(), 30000);
};   

module.exports = { checkPickUps };