let mysql = require('mysql');

// Setup database connection parameter
let connection = mysql.createConnection({
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

connection.on('error', function (e) {
    console.log(e);
});


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
    let query = "select * from (select 'event' as type, name, start from events union all select 'assignment', name, due_date from assignments) all_events where start like ? order by start";
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
