
var message = 'CSC-317 startup template\n'
    + 'This template uses nodeJS, express, and express.static\n';

var port = 3000;
var path = require('path');
var express = require('express');
var db = require('./database.js');
var app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

var StaticDirectory = path.join(__dirname, 'public');


app.use(bodyParser.json({ extended: true }));

app.post("/saveEvent", (req, res) => {
    console.log(req.body);
    res.send('POST request to the homepage');

    db.saveEvent(req.body);
});

app.use(express.static(StaticDirectory));
// Set up a route for the home page

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});

console.log(message);

