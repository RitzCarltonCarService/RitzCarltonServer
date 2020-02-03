const auth = require('./auth');
const hotels = require('./hotels');
const pickups = require('./pickups');
const availabilities = require('./availabilities');
const schedulingHelpers = require('./schedulingHelpers');
const token = require('./token');

module.exports = { auth, hotels, pickups, schedulingHelpers, availabilities, token }