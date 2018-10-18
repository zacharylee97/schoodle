"use strict";

var calendar;

// Appends the calendar to the main 
function showCalendar() {
  createCalendar();
  return $('main').append(calendar);
}

// Returns today's date
function today() {
  return new Date();
}

// Adds the week days as a header to a table
function calendarHeader() {
  return calendar += `
  <th>Su</th>
  <th>Mo</th>
  <th>Tu</th>
  <th>We</th>
  <th>Th</th>
  <th>Fr</th>
  <th>Sa</th>
  `;
}

// Call in with today() to get the first month of today"s month
function firstOfTheMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// Main function that calls the other function to fill the calendar variable
function createCalendar() {
  var day = new Date().getDay();
  var month = new Date().getMonth();
  var year = new Date().getYear();

  calendar += `<table class="calendar">`;
  calendarHeader();
  alert(firstOfTheMonth(today()));
  return calendar += `</table>`;
}
