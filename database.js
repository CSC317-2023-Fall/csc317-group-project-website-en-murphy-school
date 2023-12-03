let mysql = require('mysql');
let random = "Hello World";

// Setup database connection parameter
var connection = mysql.createConnection({
    host: 'localhost', user: 'student', password: 'student', database: 'plannerzdb'
});


// Connect with the database
connection.connect(function (e) {
    if (e) {
        // Show error message on failure
        return console.error('Error: ' + e.message);
    }


    // Show success message if connected
    console.log('\nConnected to the MySQL server...\n');
});

connection.on('error', function(e) {
    console.log(e);
});


// Set the query message
//$query = 'SELECT * from events';

// Execute the database query
//connection.query($query, function (e, rows) {
//    if (e) {
//
//        // Show the error message if we have one
//        console.log("Error ocurred in executing the query.");
//        return;
//    }
//
//
//    /* Display the formatted data retrieved from 'book' table
//    using for loop */
//    console.log("The records of calendar events:\n");
//    console.log("Event Name\t\t\t\tEvent Start\t\tEvent End\n");
//    for (let row of rows) {
//        console.log(row['event_name'], "\t\t", row['event_start'], "\t", "$", row['event_end']);
//    }
//});

function saveEvent (event) {
    try {
        let eventQuery = "insert into events (user, event_name, event_start, event_end, location, description) values (?, ?, ?, ?, ?, ?);";
        connection.query(eventQuery, [event["user"], event["event-name"], event["event-start"], event["event-end"], event["event-location"], event["event-description"]]);
    } catch (e) {
        console.log(e)
    }
}

module.exports = {"saveEvent": saveEvent};
