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

const login = function (id) {
    return new Promise ((resolve, reject) => {
        const queryString = "SELECT * FROM users WHERE id = " + [id];
        connection.query(queryString, (err, res) => {
            console.log(err, res)
            if (err) {
                reject (err);
            } else {
                resolve(res);
            }
        })
    })
}

const setName = function (id, name) {
    return new Promise ((resolve, reject) => {
        const queryString = "UPDATE users SET name = (" + [name] + ") WHERE id = " + [id];
        connection.query(queryString, (err, res) => {
            if (err) {
                reject (err);
            } else {
                resolve("success");
            }
        })
    })
}

const setEmail = function (id, email) {
    return new Promise ((resolve, reject) => {
        const queryString = "UPDATE users SET email = (" + [email] + ") WHERE id = " + [id];
        connection.query(queryString, (err, res) => {
            if (err) {
                reject (err);
            } else {
                resolve("success");
            }
        })
    })
}

const setPhoneNumber = function (id, phoneNumber) {
    return new Promise ((resolve, reject) => {
        const queryString = "UPDATE users SET phoneNumber = (" + [phoneNumber] + ") WHERE id = " + [id];
        connection.query(queryString, (err, res) => {
            if (err) {
                reject (err);
            } else {
                resolve("success");
            }
        })
    })
}

const setHotel = function (id, hotelId) {
    return new Promise ((resolve, reject) => {
        const queryString = "UPDATE users SET hotelId = (" + [hotelId] + ") WHERE id = " + [id];
        connection.query(queryString, (err, res) => {
            if (err) {
                reject (err);
            } else {
                resolve("success");
            }
        })
    })
}

module.exports = { signup, login, setName, setEmail, setPhoneNumber, setHotel }