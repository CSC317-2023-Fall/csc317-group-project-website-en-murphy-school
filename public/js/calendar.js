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
    clearMonth();

    let monthFirst = new Date(aDate);
    let monthCurrent = new Date(aDate);
    let monthFinal = new Date(aDate);

    monthFirst.setDate(aDate.getDate() + 1 - aDate.getDate());

    monthCurrent.setDate(monthFirst.getDate());
    while (monthFinal.getMonth() === monthFirst.getMonth()) {
        monthFinal.setDate(monthFinal.getDate() + 1);
    }

    monthFinal.setDate(monthFinal.getDate() - 1);

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
    for(let i = 0; i < 7 * 6; i++) {
        document.getElementsByTagName("td")[i].innerHTML = "";
    }

    document.getElementsByTagName("tr")[7].style.display = "none";
}

function displayMonth(monthNum) {
    switch (monthNum) {
        case 0: return "January";
        case 1: return "February";
        case 2: return "March";
        case 3: return "April";
        case 4: return "May";
        case 5: return "June";
        case 6: return "July";
        case 7: return "August";
        case 8: return "September";
        case 9: return "October";
        case 10: return "November";
        case 11: return "December";
    }
}