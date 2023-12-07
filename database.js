let mysql = require('mysql');
var formidable = require('formidable');
const bodyParser = require('body-parser');


// Setup database connection parameter
let connection = mysql.createConnection({
    host: 'localhost', user: 'student', password: 'student', database: 'plannerzdb'
});


// Connect with the database
connection.connect(function (e) {
    if (e) {

// Show error messaage on failure
        return console.error('error: ' + e.message);
    }


// Show success message if connected
    console.log('\nConnected to the MySQL server...\n');
    createDatabase();


});


function createDatabase() {
// qq = "DROP TABLE USER";
// console.log(qq);
// connection.query(qq, function(err, result, fields){
//     // if(err) throw err;
// });

// qq = "DROP TABLE USERSETTINGS";
// console.log(qq);
// connection.query(qq, function(err, result, fields){
//     // if(err) throw err;
// });

// qq = "CREATE TABLE USER(id INT PRIMARY KEY AUTO_INCREMENT, firstName varchar(50), lastName varchar(50), email varchar(50), password varchar (200))";
// connection.query(qq, function(err, result, fields){
//     if(err) throw err;
// });

// qq = "CREATE TABLE USERSETTINGS (id INT AUTO_INCREMENT, theme varchar(20), language varchar(20), owner_id INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (owner_id) REFERENCES USER(id))";
// console.log(qq);
// connection.query(qq, function(err, result, fields){
//     if(err) throw err;
// });

// qq = "INSERT INTO USER (firstName, lastName, email, password) VALUES('Bill', 'Willow', 'test@email.com', 'student')";
// connection.query(qq, function(err, result, fields){
//     if(err) throw err;
// });

// qq = "INSERT INTO USERSETTINGS (owner_id, theme, language) VALUES (1, 'light', 'en')";
// console.log(qq);
// connection.query(qq, function(err, result, fields){
//     if(err) throw err;
// });

    qq = "SELECT * FROM USER"
    console.log(qq);
    connection.query(qq, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });

    qq = "SELECT * FROM USERSETTINGS"
    console.log(qq);
    connection.query(qq, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });

}


// Set the query message
// $query = 'SELECT * from book';


// Execute the database query
// connection.query($query, function(e, rows) {
// if(e){

// // Show the error message if we have one
// console.log("Error ocurred in executing the query.");
// return;
// }


// /* Display the formatted data retrieved from 'book' table
// using for loop */

// });


// Close the database connection
// connection.end(function(){
// console.log('\nConnection closed.\n');
// });

function saveAssignment(event, user) {
    try {
        let eventQuery = "insert into assignments (user, name, priority, due_date, description) values (?, ?, ?, ?, ?);";
        connection.query(eventQuery, [user, event["assignment-name"], event["assignment-priority"], event["assignment-date"], event["assignment-description"]]);
    } catch (e) {
        console.log(e)
    }
}

function saveEvent(event, user) {
    try {
        let eventQuery = "insert into events (user, name, start, end, location, description) values (?, ?, ?, ?, ?, ?);";
        connection.query(eventQuery, [user, event["event-name"], event["event-start-date"], event["event-end-date"], event["event-location"], event["event-description"]]);
    } catch (e) {
        console.log(e)
    }
}

function getEvents(req, res) {
    let query = "select * from (select 'event' as type, name, start, description from events union all select 'assignment' as type, name, due_date, description from assignments) all_events where start like ? order by start";
    try {
        let month = req.body.month + "%";
        //let month = "%";
        console.log("Retrieving events for " + month);
        connection.query(query, [month], function (e, rows) {
            // Callback function when the database call completes
            if (e) {

                // Show the error message if we have one
                console.log("Error occurred in executing the query.");
                return;
            }


            /* Display the formatted data retrieved from 'book' table
            using for loop */
            console.log("The records of calendar events:\n");
            console.log("Type|Name|Start");
            for (let row of rows) {
                console.log(row['type'], "|", row['name'], "|", row['start']);
            }
            console.log(JSON.stringify(rows));
            // Return the AJAX response to the get event call
            res.send(rows);
        });
    } catch (e) {
        console.log(e)
    }
}

// These are the functions that are visible to the instantiation of this module
module.exports = {"saveEvent": saveEvent, "saveAssignment": saveAssignment, "getEvents": getEvents};
