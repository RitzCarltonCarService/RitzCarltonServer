const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

// app.use((_, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//routes go here
const { auth, hotels, pickups, scheduleRide, availabilities } = require('./routes');
app.use(auth, hotels, pickups, scheduleRide, availabilities);

app.get("/", (req, res) => {
    res.send("Drive yourself!")
})


app.listen(3000, () => {
    console.log("Server listening on port 3000");
})