var message = 'CSC-317 startup template\n'
         + 'This template uses nodeJS, express, and express.static\n';

var port = 3000;
var path = require('path');
var formidable = require('formidable');
var express = require('express');
var database = require('./database');
var app = express();
var cookieParser = require('cookie-parser');
const fs = require('fs');
const bodyParser = require('body-parser');
let mysql = require('mysql');
app.use(cookieParser());

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
        connection.connect(function(err) {
            if (err) throw err;
            let qq = "INSERT INTO USER (firstName, lastName, email, password) VALUES('" + ffields.firstName +"', '" + ffields.lastName + "', '" + ffields.loginEmail + "', '" + ffields.password +"')";
            console.log(qq);
            connection.query(qq, function(err, result, fields) {
                if(err) throw err;
                var resstr = ''
                console.log(result);
                qq = "INSERT INTO USERSETTINGS (owner_id, theme, language) VALUES ("+ result.insertId + ", 'light', 'en')";
                connection.query(qq,function(err, result, fields){
                    if(err) throw err;
                    resstr = resstr + "" + qq;
                    return res.redirect('/login.html');
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
    form.parse(req, function(err, ffields, files) {
        connection.connect(function(err) {
            if(err) throw err;
            let qq  = "SELECT * FROM USER WHERE email='" + ffields.email + "' AND password='" + ffields.password + "'";
            console.log(qq);
            connection.query(qq, function(err, result, fields) {
                if(err) throw err;
                let login = 'false';
                console.log(result);
                if(result.length == 0){
                    login='';
                }else {login='true'}
                res.cookie('loggedIn', login, {sameSite:'lax', path:'/'});
                // res.cookie('id', )
                console.log(req.cookies);
                res.redirect('/index.html');
                // res.redirect('/index.html');

            })
        })
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
