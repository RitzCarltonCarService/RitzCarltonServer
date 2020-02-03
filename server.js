const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//routes go here
const { auth, hotels, pickups, scheduleRide, availabilities, carTracker, addToken } = require('./routes');
app.use(auth, hotels, pickups, scheduleRide, availabilities, carTracker, addToken);

app.get("/", (req, res) => {
    res.send("Drive yourself! Or don't.")
})

app.listen(3000, () => {
    console.log("Server listening on port 3000");
})