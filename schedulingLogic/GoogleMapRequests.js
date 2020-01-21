const dotenv = require('dotenv');
dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const axios = require('axios');

//checks to see whether a pickup will fit between two other travel nodes
const validatePickup = function (startNode, endNode, pickup) {

    console.log("validatePickup is running");

    return new Promise ((resolve, reject) => {

        const params1 = {
            origins: startNode.endLat + "," + startNode.endLng,
            departure_time: startNode.estimatedEndTime.getTime(),
            destinations: pickup.startLat + "," + pickup.startLng,
            key: GOOGLE_MAPS_API_KEY
        };
    
        const params2 = {
            origins: pickup.startLat + "," + pickup.startLng,
            departure_time: new Date(pickup.startTime).getTime(),
            destinations: pickup.endLat + "," + pickup.endLng,
            key: GOOGLE_MAPS_API_KEY
        };
    
        const params3 = {
            origins: pickup.endLat + "," + pickup.endLng,
            departure_time: null,
            destinations: endNode.startLat + "," + endNode.startLng,
            key: GOOGLE_MAPS_API_KEY
        };
    
        axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: params1
        })
        .then((result) => {
            if (params1.departure_time + (result.data.rows[0].elements[0].duration.value * 1010)  >= params2.departure_time) {
                console.log("FAIL")
                resolve(null);
            }
            return axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                params: params2
            })
        })
        .then((result) => {
            console.log("First leg succeeded");
            result2 = result.data;
            if (params2.departure_time + (result.data.rows[0].elements[0].duration.value * 1010) >= endNode.estimatedStartTime.getTime()) {
                console.log("FAIL")
                resolve(null);
            }
            params3.departure_time = params2.departure_time + (result.data.rows[0].elements[0].duration.value * 1010);
            return axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                params: params3
            })
        })
        .then((result) => {
            console.log("Second leg succeeded");
            if (params3.departure_time + (result.data.rows[0].elements[0].duration.value * 1010) >= endNode.estimatedStartTime.getTime()) {
                console.log("FAIL");
                resolve(null);
            }
            console.log("Third leg succeeded");
            resolve({estimatedEndTime: params3.departure_time});
        })
        .catch((err) => {
            reject(err);
        })
    })

}

module.exports = { validatePickup };