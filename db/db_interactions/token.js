const connection = require('../db');

const addToken = function (userID, tokenID) {
    return new Promise((resolve, reject) => {
        const queryString = `UPDATE users SET token=("${tokenID}") WHERE id="${userID}";`
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