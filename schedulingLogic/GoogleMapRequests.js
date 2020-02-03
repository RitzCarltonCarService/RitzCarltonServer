const dotenv = require('dotenv');
dotenv.config();

const GOOGLE_MAPS_APIKEY = process.env.GOOGLE_MAPS_APIKEY;
const axios = require('axios');

//checks to see whether a pickup will fit between two other travel nodes
const validatePickup = function (startNode, endNode, pickup, now) {

    console.log("validatePickup is running");

    return new Promise ((resolve, reject) => {

        const params1 = {
            origins: startNode.endLat + "," + startNode.endLng,
            departure_time: startNode.estimatedEndTime.getTime(),
            destinations: pickup.startLat + "," + pickup.startLng,
            key: GOOGLE_MAPS_APIKEY
        };
    
        const params2 = {
            origins: pickup.startLat + "," + pickup.startLng,
            departure_time: now ? null : new Date(pickup.startTime).getTime(),
            destinations: pickup.endLat + "," + pickup.endLng,
            key: GOOGLE_MAPS_APIKEY
        };
    
        const params3 = {
            origins: pickup.endLat + "," + pickup.endLng,
            departure_time: null,
            destinations: endNode.startLat + "," + endNode.startLng,
            key: GOOGLE_MAPS_APIKEY
        };
    
        axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: params1
        })
        .then((result) => {
            console.log("Time at 1: " + new Date(params1.departure_time));
            console.log("Time from 1 to 2: " + result.data.rows[0].elements[0].duration.value * 1000);
            console.log("Summed: " + (params1.departure_time + result.data.rows[0].elements[0].duration.value * 1000));
            console.log("When pickup needs to happen: " + new Date(params2.departure_time));
            if (params2.departure_time && params1.departure_time + (result.data.rows[0].elements[0].duration.value * 1010)  >= params2.departure_time) {
                console.log("No space")
                resolve(null);
                return;
            }
            if (!params2.departure_time) {
                params2.departure_time = params1.departure_time + (result.data.rows[0].elements[0].duration.value * 1010);
                pickup.startTime = params2.departure_time;
            }
            return axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                params: params2
            })
        })
        .then((result) => {
            if (!result) return;
            console.log("First leg succeeded");
            result2 = result.data;
            if (params2.departure_time + (result.data.rows[0].elements[0].duration.value * 1010) >= endNode.estimatedStartTime.getTime()) {
                console.log("No space")
                resolve(null);
                return;
            }
            params3.departure_time = params2.departure_time + (result.data.rows[0].elements[0].duration.value * 1010);
            return axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                params: params3
            })
        })
        .then((result) => {
            if (!result) return;
            console.log("Second leg succeeded");
            console.log(JSON.stringify(params3));
            console.log(JSON.stringify(result.data.rows[0]));
            if (params3.departure_time + (result.data.rows[0].elements[0].duration.value * 1010) >= endNode.estimatedStartTime.getTime()) {
                console.log("No space");
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