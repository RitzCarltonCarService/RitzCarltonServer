let carData = {
    // 1: {
    //     lat: 29.7620,
    //     lng: -95.3692,
    //     newInfo: false
    // },
    // 2: {
    //     lat: 29.7615,
    //     lng: -95.3700,
    //     newInfo: false
    // }
};

const updateCarLocation = function (id, lat, lng) {
    if (!carData[id]) {
        carData[id] = {};
        carData[id].newInfo = false;
    }
    carData[id].lat = lat;
    carData[id].lng = lng;
}

const updateRetrieveNewInfo = function (id, value) {
    console.log(id);
    if (!carData[id]) {carData[id] = {}};
    carData[id].newInfo = value;
    console.log(carData[id])
    console.log(carData[1]);
}

const getCarLocation = function (id) {
    return {
        lat: carData[id].lat,
        lng: carData[id].lng
    }
}

const getNewInfo = function (id) {
    return carData[id].newInfo;
}

module.exports = { updateCarLocation, updateRetrieveNewInfo, getCarLocation, getNewInfo }