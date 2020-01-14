const connection = require('../db');

const signup = function (id, type, hotelId, name, email, phoneNumber) {
    console.log(id, type, hotelId)
    return new Promise((resolve, reject) => {
        const queryString = "INSERT INTO users (id, type, hotelId, name, email, phoneNumber) "
            + "VALUES (" + [id, type, hotelId, name, email, phoneNumber].join(", ") + ")";
        connection.query(queryString, (err) => {
            if (err) {
                reject (err);
            } else {
                resolve("success");
            }
        })
    })
}

module.exports = { signup }