const connection = require('../db');

const addToken = function (userID, tokenID) {
    return new Promise((resolve, reject) => {
        const queryString = `INSERT INTO users (token) VALUES ('${tokenID}') WHERE id = ${userID};`
        connection.query(queryString, (err, res) => {
            if (err) {
                reject (err);
            } else {
                resolve(res);
            }
        })
    })
}

module.exports = { addToken }