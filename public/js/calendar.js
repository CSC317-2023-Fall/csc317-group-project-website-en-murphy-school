let currentDate = new Date();
let displayDate = new Date(currentDate);

displayCalendar(displayDate);

function forwardMonth() {
    displayDate.setMonth(displayDate.getMonth() + 1);
    displayCalendar(displayDate);
}

function backwardMonth() {
    displayDate.setMonth(displayDate.getMonth() - 1);
    displayCalendar(displayDate);
}

function displayCalendar(aDate) {
    let monthCurrent = new Date(aDate);
    let monthFinal = new Date(aDate);
    let xhrEvents = new XMLHttpRequest();
    let xhrAssignments = new XMLHttpRequest();


    clearMonth();

    monthCurrent.setDate(1);

    while (monthFinal.getMonth() === monthCurrent.getMonth()) {
        monthFinal.setDate(monthFinal.getDate() + 1);
    }

    monthFinal.setDate(monthFinal.getDate() - 1);

    renderCalendar(monthCurrent, monthFinal, null);

    monthCurrent = new Date(aDate);
    monthCurrent.setDate(1);

    // opens request.  The third parameter indicates that this is a synchronous request, meaning that execution will block
    // until the request returns something
    xhrEvents.open("POST", "/getEvents", false);
    xhrAssignments.open("POST", "/getAssignments", false);

    // This is REALLY IMPORTANT so that the server knows the JSON is approaching at mach-3
    xhrEvents.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhrAssignments.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    let user = getUserId();

    // send it
    let doc = {"month": monthCurrent.getFullYear().toString() + "-" + (monthCurrent.getMonth() + 1).toString().padStart(2, "0"), "user": user};
    //alert (JSON.stringify(doc));
    // This will only return when the response comes back from the server.
    xhrEvents.send(JSON.stringify(doc));
    xhrAssignments.send(JSON.stringify(doc));

    let calendarThings = JSON.parse(xhrEvents.response).concat(JSON.parse(xhrAssignments.response));

    // Rerender the calendar once you have the right events.
    renderCalendar(monthCurrent, monthFinal, calendarThings);
}

function renderCalendar(monthCurrent, monthFinal, events) {
    let hasEvents = false;
    document.getElementById("calendar-loading").style.visibility = "visible";
    if (events !== null) {
        document.getElementById("calendar-loading").style.visibility = "hidden";
        hasEvents = true;

        //alert(displayMonth(monthCurrent.getMonth()) + " events:\n" + events)
    }

    let week = 0;

    document.getElementById("month-display").innerHTML = displayMonth(monthCurrent.getMonth());
    document.getElementById("year-display").innerHTML = monthCurrent.getFullYear().toString();

    while (monthCurrent <= monthFinal) {
        if (monthCurrent.getDay() === 0 && monthCurrent.getDate() !== 1) {
            week++;
        }

        document.getElementById("month").getElementsByTagName("tr")[2 + week]
            .getElementsByTagName("td")[monthCurrent.getDay()].innerHTML = monthCurrent.getDate().toString();
        if(hasEvents) {
            document.getElementById("month").getElementsByTagName("tr")[2 + week]
                .getElementsByTagName("td")[monthCurrent.getDay()].innerHTML += insertEvents(events, monthCurrent.getDate().toString().padStart(2, "0"));
        }

        monthCurrent.setDate(monthCurrent.getDate() + 1);
    }

    if(!hasEvents) {
        document.getElementById("calendar-loading").style.visibility = "hidden";
    }

    if (week === 5) {
        document.getElementsByTagName("tr")[7].style.display = "";
    }

    function insertEvents(events, day) {
        let toInsert = Array();
        let eventDisplay = "<ul>";

        for(let i in events) {
            if (events[i].type === "event") {
                if (events[i].start.toString().slice(8, 10) === day.padStart(2, "0")) {
                    toInsert.push(events[i]);
                }
            } else if (events[i].type === "assignment") {
                if (events[i].due_date.toString().slice(8, 10) === day.padStart(2, "0")) {
                    toInsert.push(events[i]);
                }
            }
        }


        function insertPriorityImage(toInsertElement) {
            let image;
            let priority;

            switch (toInsertElement.priority) {
                case 1:
                    priority = "low";
                    image = "low.png";
                    break;
                case 2:
                    priority = "medium";
                    image = "medium.png";
                    break;
                case 3:
                    priority = "high";
                    image = "high.png";
                    break;
                default:
                    priority = "no";
                    image = "none.png";
                    break;
            }

            return "<img class='assignment-priority' src='/images/priority/" + image + "' alt='(" + priority + " priority) '>";
        }

        for (let i in toInsert) {


            if (toInsert[i].type.toString() === "assignment") {
                let time = toInsert[i].due_date.toString();
                let timeString = time.slice(0, 10) + " " + time.slice(11, 16);

                eventDisplay += "<li class='assignment'>" + toInsert[i].name.toString() + "<div><h2 class='assignment-name'>"
                    + insertPriorityImage(toInsert[i]) + toInsert[i].name.toString() +
                    "</h2><p class='assignment-time'>" + timeString + "</p><p class='assignment-description'>" +
                    toInsert[i].description.toString() + "</p></div></li><br/>";
            } else if (toInsert[i].type.toString() === "event") {
                let startTime = toInsert[i].start.toString();
                let startTimeString = startTime.slice(0, 10) + " " + startTime.slice(11, 16);
                let endTime = toInsert[i].end.toString();
                let endTimeString = endTime.slice(0, 10) + " " + endTime.slice(11, 16);

                eventDisplay += "<li class='event'>" + toInsert[i].name.toString() + "<div><h2 class='event-name'>" + toInsert[i].name.toString() +
                    "</h2><p class='event-time'>" + startTimeString + " - " + endTimeString + "</p><p class='event-description'>" +
                    toInsert[i].description.toString() + "</p><p class='event-location'>" + toInsert[i].location.toString() + "</p></div></li><br/>";
            }
        }

        eventDisplay += "</ul>"
        return eventDisplay;
    }
}

function clearMonth() {
    for (let i = 0; i < 7 * 6; i++) {
        document.getElementsByTagName("td")[i].innerHTML = "";
    }

    document.getElementsByTagName("tr")[7].style.display = "none";
}

function displayMonth(monthNum) {
    switch (monthNum) {
        case 0:
            return "January";
        case 1:
            return "February";
        case 2:
            return "March";
        case 3:
            return "April";
        case 4:
            return "May";
        case 5:
            return "June";
        case 6:
            return "July";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "October";
        case 10:
            return "November";
        case 11:
            return "December";
    }
}

function saveEvent() {
    let xhr = new XMLHttpRequest();
    let user = getUserId();

    // create a dictionary containing all the table fields
    let eventDetail = {
        "user": user,
        "event-name": document.getElementById("event-name").value,
        "event-start-date": document.getElementById("event-start-date").value,
        "event-end-date": document.getElementById("event-end-date").value,
        "event-location": document.getElementById("event-location").value,
        "event-description": document.getElementById("event-description").value
    };

    // opens request
    xhr.open("POST", "/saveEvent", false);
    // This is REALLY IMPORTANT so that the server knows the JSON is approaching at mach-3
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    // send it
    xhr.send(JSON.stringify(eventDetail));
}

function saveAssignment() {
    let xhr = new XMLHttpRequest();
    let assignmentRadio = document.getElementsByName("assignment-priority");
    let radioValue = 0;
    let user = getUserId();

    for (let i = 0; i < assignmentRadio.length; i++) {
        if (assignmentRadio[i].checked) {
            radioValue = i;
        }
    }

    // create a dictionary containing all the table fields
    let assignmentDetail = {
        "user": user,
        "assignment-name": document.getElementById("assignment-name").value,
        "assignment-priority": radioValue,
        "assignment-date": document.getElementById("assignment-date").value,
        "assignment-description": document.getElementById("assignment-description").value,
    };

    // opens request
    xhr.open("POST", "/saveAssignment");
    // This is REALLY IMPORTANT so that the server knows the JSON is approaching at mach-3
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    // send it
    xhr.send(JSON.stringify(assignmentDetail));
}

function getUserId() {
    let cookies = document.cookie.split("; ");
    let user = "";

    for (let i in cookies) {
        if (cookies[i].indexOf("id") >= 0) {
            user = cookies[i].substring(3);
        }
    }

    return user;
}