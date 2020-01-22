const auth = require('./auth');
const hotels = require('./hotels')
const pickups = require('./pickups')
const scheduleRide = require('./scheduleRide');
const availabilities = require('./availabilities');
const carTracker = require('./carTracker');

module.exports = { auth, hotels, pickups, scheduleRide, availabilities, carTracker }