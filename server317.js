let message = 'CSC-317 startup template\n'
    + 'This template uses nodeJS, express, and express.static\n';

let port = 3000;
let path = require('path');
let express = require('express');
let db = require('./database.js');
let app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

let StaticDirectory = path.join(__dirname, 'public');


app.use(bodyParser.json({ extended: true }));

// Router for save event AJAX call
app.post("/saveEvent", function (req, res) {
    console.log(req.body);
    res.send('POST request to the homepage (new event)');

    db.saveEvent(req.body, "putUser");
});

// Router for save Assignment AJAX call
app.post("/saveAssignment", function (req, res) {
    console.log(req.body);
    res.send('POST request to the homepage (new assignment)');

    db.saveAssignment(req.body, "putUser");
});

// Router for get events AJAX call
app.post("/getEvents", function (req, res) {
    console.log(req.body);
    db.getEvents(req, res);
});

app.use(express.static(StaticDirectory));
// Set up a route for the home page

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});

console.log(message);

