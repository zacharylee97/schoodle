"use strict";

var calendar = "";

// Appends the calendar to the main
function showCalendar(date) {
  $('.calendarTable').empty();
  calendar = '';
  createCalendar(date);
  $('.calendarTable').append(calendar);
}

// Adds the week days as a header to a table
function calendarHeader() {
  return calendar +=
  `<tr>
    <th>Su</th>
    <th>Mo</th>
    <th>Tu</th>
    <th>We</th>
    <th>Th</th>
    <th>Fr</th>
    <th>Sa</th>
  </tr>`;
}

// Call in with today() to get the first month of today"s month
function firstOfTheMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// Call in with today() to get the first month of today"s month
function lastOfTheMonth(date) {
  return new Date(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

//Returns the day of the week (0-6)
function dayOfTheWeek(date) {
  return date.getDay();
}

// Return the amount of days in a month
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Adds each days before the calendar month to the calendar call with the result of
// dayOfTheWeek(firstOfTheMonth)
function daysBeforeMonth(firstOfMonthDay, date) {
  calendar += `<tr>`;
  for (var i = firstOfMonthDay - 1; i >= 0; i--) {
    calendar += `<td class="calendarCell calendarOutsideMonth">${daysInMonth(date.getFullYear(), date.getMonth() - 1) - i}</td>`
  }
}

// Adds each days on the calendar of the selected month
function daysDuringMonth(date) {
  var monthLength = daysInMonth(date.getFullYear(), date.getMonth());
  for (var i = 1; i <= monthLength; i++) {
    calendar += `<td class="calendarCell">${i}</td>`
    if (dayOfTheWeek(new Date(date.getFullYear(), date.getMonth(), i)) === 6) {
      calendar += `</tr><tr>`;
    }
  }
}

// Adds each days before the calendar month to the calendar call with the result of
// dayOfTheWeek(firstOfTheMonth)
function daysAfterMonth(lastOfMonthDay) {
  for (var i = 1; i < 7 - dayOfTheWeek(lastOfMonthDay); i++) {
    calendar += `<td class="calendarCell calendarOutsideMonth">${i}</td>`
  }
  calendar += `</tr>`;
}

// Main function that calls the other function to fill the calendar variable
function createCalendar(calendarDate) {
  var months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  $('.calendarDate').text(`${months[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`)
  .data(calendarDate);

  //Start of Calendar
  // calendar += `<table class="calendar">`

  // Adding in the header (2 letters per <th>)
  calendarHeader();

  // Adding the days before the first of the month
  daysBeforeMonth(dayOfTheWeek(firstOfTheMonth(calendarDate)), calendarDate);

  // Adding the days during the month
  daysDuringMonth(calendarDate);

  //Adding the days after the month
  daysAfterMonth(lastOfTheMonth(calendarDate));

  //End of Calendar
  // calendar += `</table>`
}
