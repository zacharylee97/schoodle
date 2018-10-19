$(() => {
  function generateRandomString(lengthURL) {
    const possibleChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let randomURL = "";
    for (var i = 0; i < lengthURL; i++) {
      randomURL += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }
    return randomURL;
  }
  function multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for (var i = 0; i < arr.length; i++) {
      var stringified = JSON.stringify(arr[i]);
      if (itemsFound[stringified]) { continue; }
      uniques.push(arr[i]);
      itemsFound[stringified] = true;
    }
    return uniques;
  }

  function formatDate(date) {
    return [date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()].join('-') + ' ' +
      [date.getHours(),
      date.getMinutes(),
      date.getSeconds()].join(':');
  }


  function checkForm() {
    if ($('[name=title]').val() && $('[name=description]').val() && $('[name=name]').val() && $('[name=email]').val()) {
      return true;
    } else {
      return false;
    }
  }

  //Display time slots when date is selected on calendar
  var selectedDates = [];
  var months = {
    'January': '0',
    'February': '1',
    'March': '2',
    'April': '3',
    'May': '4',
    'June': '5',
    'July': '6',
    'August': '7',
    'September': '8',
    'October': '9',
    'November': '10',
    'December': '11'
  }

  $('.calendar').on('click', '.calendarCell', function () {
    if ($(this).hasClass('calendarOutsideMonth')) {
    } else {
      $(this).toggleClass('calendarSelectedCell');
      let $day = $(this).text();
      let monthAndYear = $(this).closest('.calendar').find('.calendarDate').text().split(" ");
      let $month = monthAndYear[0];
      let monthNum = months[$month];
      let $year = monthAndYear[1];
      let $date = `${$month} ${$day} ${$year}`;
      let dateClass = `${$year}-${monthNum}-${$day}`
      if ($('p').hasClass(dateClass)) {
        $(`.${dateClass}`).remove();
        selectedDates.splice(selectedDates.indexOf(dateClass), 1);
      } else {
        $(this).parents().siblings('.times')
          .append(`<p class=${dateClass}>${$date}</p>`);
        $(".submit").css("display", "block");
        selectedDates.push(dateClass);
      }
    }
  });

  //Change month of calendar when clicking arrows
  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  $('.calendar').on('click', '.fa-arrow-left', function () {
    currentMonth -= 1;
    today.setMonth(currentMonth);
    if (currentMonth === -1) {
      currentMonth = 11;
      currentYear -= 1;
    }
    showCalendar(today);
    //Highlight dates previously selected
    let dateMatch = [];
    selectedDates.forEach(function (element) {
      let date = element.split("-");
      let year = parseInt(date[0]);
      let month = parseInt(date[1]);
      let day = date[2];
      if (year === currentYear && month === currentMonth) {
        dateMatch.push(day);
      }
    })
    dateMatch.forEach(function (day) {
      $(`td[data-date=${day}]`).addClass('calendarSelectedCell');
    });
  });
  $('.calendar').on('click', '.fa-arrow-right', function () {
    currentMonth += 1;
    today.setMonth(currentMonth);
    if (currentMonth === 12) {
      currentMonth = 0;
      currentYear += 1;
    }
    showCalendar(today);
    //Highlight dates previously selected
    let dateMatch = [];
    selectedDates.forEach(function (element) {
      let date = element.split("-");
      let year = parseInt(date[0]);
      let month = parseInt(date[1]);
      let day = date[2];
      if (year === currentYear && month === currentMonth) {
        dateMatch.push(day);
      }
    })
    dateMatch.forEach(function (day) {
      $(`td[data-date=${day}]`).addClass('calendarSelectedCell');
    });
  });

  //Post to db on form submission
  $('.new-event-form').on('submit', function (e) {
    e.preventDefault();
    const formValid = checkForm();
    if (formValid) {
      let uniqueUrl = generateRandomString(12);
      $.ajax({
        method: "POST",
        url: "/events",
        data: {
          title: $('[name=title]').val(),
          description: $('[name=description]').val(),
          name: $('[name=name]').val(),
          email: $('[name=email]').val(),
          time_start: new Date(),
          time_end: new Date(),
          unique_url: uniqueUrl
        }
      }).done(() => {
        window.location.href = `/events/${uniqueUrl}`;
      });
    } else {
      alert("Please fill in the form!");
    }
  });

  //Onclick function for create-new-event button
  $("#new-event-btn").click(function () {
    window.location.href = "/events/new";
  });

  //Load event details for event
  if ($(".event-details").length > 0) {
    const URL = window.location.href;
    const uniqueURL = URL.slice(-12);
    $.ajax({
      method: "GET",
      url: `/events/${uniqueURL}/info`
    })
      .done((result) => {
        //Display event details
        const eventDetails = `
          <h1>Event Details</h1>
          <p>Event title: ${result[0].title}</p>
          <p>Event description: ${result[0].description}</p>`;

        $(".event-details").prepend(eventDetails);

        //Filter through the attendees
        const attendeesInfo = [];
        result.forEach(function (attendee) {
          attendeesInfo.push({
            name: attendee.name,
            email: attendee.email,
            id: attendee.attendees_id
          });
        });
        var attendees = multiDimensionalUnique(attendeesInfo);

        //Filter through the events times
        const timesInfo = [];
        result.forEach(function (time) {
          timesInfo.push({
            start: time.time_start,
            end: time.time_end,
            id: time.times_id
          });
        });
        var times = multiDimensionalUnique(timesInfo);

        // Takes every connection between times and attendees
        const timesAttendees = [];
        result.forEach(function (availability) {
          timesAttendees.push({
            time_id: availability.times_id,
            attendee_id: availability.attendees_id
          });
        });

        // Load timeslots 
        var eventInfo = `<tr><th></th>`
        times.forEach((time) => {
          eventInfo += `<th>${formatDate(new Date(time.start))} <br> ${formatDate(new Date(time.end))}</th>`
        })
        eventInfo += `</tr>`;

        // Load every attendees with their availability
        console.log(attendees);
        console.log(times);
        console.log(timesAttendees);
        attendees.forEach((attendee) => {
          eventInfo += `<tr><td>${attendee.name} <br> ${attendee.email}</td>`;

          times.forEach((time) => {
            eventInfo += `<td data-time-id=${time.id} data-attendee-id=${attendee.id}></td>`
          })
          eventInfo += `</tr>`;
        })
        $(".time-slots").append(eventInfo);

        timesAttendees.forEach((availability) => {
          $(`td[data-time-id = ${availability.time_id}][data-attendee-id = ${availability.attendee_id}]`).addClass('bg-success');
        })
      });
  }
});
