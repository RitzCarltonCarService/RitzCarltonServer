const mysql = require('mysql');
require('dotenv').config();

var connection = mysql.createConnection({
    host: 'ritzuber.cgmhnhykd7qi.us-east-2.rds.amazonaws.com',
    port: '3306',
    user: 'ritzuber',
    password: process.env.DB_PASSWORD,
    database: 'ritzuber'
});

connection.connect((res) => console.log("connected to db, ", res));

module.exports = connection;

