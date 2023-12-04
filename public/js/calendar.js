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
    let xhr = new XMLHttpRequest();

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
    xhr.open("POST", "/getEvents", false);

    // This is REALLY IMPORTANT so that the server knows the JSON is approaching at mach-3
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    // send it
    let doc = {"month": monthCurrent.getFullYear().toString() + "-" + (monthCurrent.getMonth() + 1).toString().padStart(2, "0")};
    //alert (JSON.stringify(doc));
    // This will only return when the response comes back from the server.
    xhr.send(JSON.stringify(doc));

    // Rerender the calendar once you have the right events.
    renderCalendar(monthCurrent, monthFinal, xhr.response);
}

function renderCalendar(monthCurrent, monthFinal, events) {
    if (events !== null) {
        document.getElementById("calendar-loading").style.visibility = "hidden";

        //alert(displayMonth(monthCurrent.getMonth()) + " events:\n" + events)
    } else {
        document.getElementById("calendar-loading").style.visibility = "visible";
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
        monthCurrent.setDate(monthCurrent.getDate() + 1);
    }

    if (week === 5) {
        document.getElementsByTagName("tr")[7].style.display = "";
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

    // create a dictionary containing all the table fields
    let eventDetail = {
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

    for (let i = 0; i < assignmentRadio.length; i++) {
        if (assignmentRadio[i].checked) {
            radioValue = i;
        }
    }

    // create a dictionary containing all the table fields
    let assignmentDetail = {
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

