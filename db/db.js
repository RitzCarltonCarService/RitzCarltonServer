const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

var connection = mysql.createConnection({
    host: 'ritzuber1.cgmhnhykd7qi.us-east-2.rds.amazonaws.com',
    port: '3306',
    user: 'ritzuber1',
    password: 'ritzuber1',
    database: 'ritzuber1'
});

connection.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("connected to db")
});

module.exports = connection;