var message = 'CSC-317 startup template\n'
         + 'This template uses nodeJS, express, and express.static\n';

var port = 3000;
var path = require('path');
var formidable = require('formidable');
var express = require('express');
let db = require('./database.js');
var app = express();
var cookieParser = require('cookie-parser');
const fs = require('fs');
const bodyParser = require('body-parser');
let mysql = require('mysql');
app.use(cookieParser());

var bcrypt = require('bcrypt')
const saltRounds = 12;

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

var StaticDirectory = path.join(__dirname, 'public');

app.use(express.static(StaticDirectory));
// Set up a route for the home page

app.post('/signupForm', function (req, res) {
    var form = new formidable.IncomingForm();
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'student',
        password: 'student',
        database: 'plannerzdb'
    });

    form.parse(req, function (err, ffields, files) {
        // Ensure the password is a string
        const password = String(ffields.password);

        // Generate a salt and hash for the password
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) throw err;

            connection.connect(function (err) {
                if (err) throw err;

                let qq = "INSERT INTO USER (firstName, lastName, email, password) VALUES('" + ffields.firstName + "', '" + ffields.lastName + "', '" + ffields.loginEmail + "', '" + hash + "')";
                console.log(qq);

                connection.query(qq, function (err, result, fields) {
                    if (err) throw err;

                    var resstr = '';
                    console.log(result);

                    qq = "INSERT INTO USERSETTINGS (owner_id, theme, language) VALUES (" + result.insertId + ", 'light', 'en')";
                    connection.query(qq, function (err, result, fields) {
                        if (err) throw err;
                        resstr = resstr + "" + qq;
                        return res.redirect('/login.html');
                    });
                });
            });
        });
    });
});

app.post('/signIn', function (req, res) {
    var form = new formidable.IncomingForm();
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'student',
        password: 'student',
        database: 'plannerzdb'
    });

    form.parse(req, function (err, ffields, files) {
        connection.connect(function (err) {
            if (err) throw err;

            let qq = "SELECT * FROM USER WHERE email='" + ffields.email + "'";
            console.log(qq);

            connection.query(qq, function (err, result, fields) {
                if (err) throw err;

                if (result.length > 0) {
                    // Ensure the user-provided password is a string
                    const providedPassword = String(ffields.password);

                    // Compare the provided password with the hashed password in the database
                    bcrypt.compare(providedPassword, result[0].password, function (err, match) {
                        if (err) throw err;

                        let login = match ? 'true' : 'false';
                        res.cookie('loggedIn', login, { sameSite: 'lax', path: '/' });

                        if (match) {
                            // Passwords match, proceed with redirect
                            console.log(req.cookies);
                            res.redirect('/index.html');
                        } else {
                            // Passwords do not match, handle accordingly (e.g., redirect to login page)
                            res.redirect('/login.html');
                        }
                    });
                } else {
                    // User not found, handle accordingly (e.g., redirect to login page)
                    res.redirect('/login.html');
                }
            });
        });
    });
});

app.post("/saveAccountSettings", function(req,res) {
    var form = new formidable.IncomingForm();
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'student',
        password: 'student',
        database: 'plannerzdb'
    });

    console.log(req.body);
    // database.saveAccountSettings;
});

app.post("/savePreferenceSettings", function(req,res) {
    var form = new formidable.IncomingForm();
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'student',
        password: 'student',
        database: 'plannerzdb'
    });

    console.log(req,body);
    // database.savePreferenceSettings;
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});

console.log(message);
