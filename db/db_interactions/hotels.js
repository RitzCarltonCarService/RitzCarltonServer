const connection = require('../db');

const getHotels = function () {
    return new Promise((resolve, reject) => {
        const queryString = "SELECT * FROM hotels";
        connection.query(queryString, (err, res) => {
            if (err) {
                reject (err);
            } else {
                resolve(res);
            }
        })
    })
}

module.exports = { getHotels }

//ignore this comment