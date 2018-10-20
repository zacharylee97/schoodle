$(() => {
  var times;

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

  function getTimeSlots() {
    let result = "";
    selectedDates.sort(function (a, b) {
      let dateA = a.split("-");
      let dateB = b.split("-");
      //Check year
      if (dateA[0] === dateB[0]) {
        //Check month
        if (dateA[1] === dateB[1]) {
          //Check date
          return dateA[2] - dateB[2];
        } else {
          return dateA[1] - dateB[1];
        }
      } else {
        return dateA[0] - dateB[0];
      }
    })
    console.log(selectedDates);
    selectedDates.forEach(function (element) {
      let date = element.split("-");
      let year = date[0];
      let month = getMonth(months, date[1]);
      let day = date[2];
      result +=
      `<div class=${element}>
        <p class=timeslot-header>${month} ${day} ${year}</p>
        <div class=time-input data-date=${element}>
          <span class='timeslot-pair'>
            <input class='add-time' data-time=start type='text' placeholder="00:00"></textarea>
            <input class='add-time' data-time=end type='text' placeholder="00:00"></textarea>
          </span>
          <br>
        </div>
        <button class="add-timeslot">+</button>
      </div>`;
    });
    return result;
  }

  function getMonth(months, num) {
    return Object.keys(months).find(key => months[key] === num);
  }

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

  //Display time slots when date is selected on calendar
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
      if ($('div').hasClass(dateClass)) {
        $(`div.${dateClass}`).remove();
        selectedDates.splice(selectedDates.indexOf(dateClass), 1);
      } else {
        selectedDates.push(dateClass);
        $(this).parents().siblings('.times')
          .empty()
          .append(getTimeSlots());
        $(".submit").css("display", "block");
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
  $('.new-event-form').on('click', '.submit', function (e) {
    e.preventDefault();
    const formValid = checkForm();
    if (formValid) {
      let uniqueUrl = generateRandomString(12);
      let times = [];
      $('.time-input').children('.timeslot-pair').each(function(index, element) {
        let date = $(this).parent().data('date');
        let time_start = $(this).children("input[data-time='start']").val();
        let time_end = $(this).children("input[data-time='end']").val();
        times.push({
          date: date,
          time_start: time_start,
          time_end: time_end
        });
        console.log(times);
      });
      $.ajax({
        method: "POST",
        url: "/events",
        data: {
          title: $('[name=title]').val(),
          description: $('[name=description]').val(),
          name: $('[name=name]').val(),
          email: $('[name=email]').val(),
          times: times,
          unique_url: uniqueUrl
        }
      }).done(() => {
        window.location.href = `/events/${uniqueUrl}`;
      });
    } else {
      timeSlots.forEach(function(element) {
        console.log(element.val);
      })
      alert("Please fill in the form!");
    }
  });

  //Add new timeslot for date
  $('.times').on('click','.add-timeslot', function (event) {
    event.preventDefault();
    let timeslot =
    `<span class='timeslot-pair'>
      <input class='add-time' data-time=start type='text' placeholder="00:00"></textarea>
      <input class='add-time' data-time=end type='text' placeholder="00:00"></textarea>
    </span>
    <br>`
    $(this).parent().children('.time-input').append(timeslot);
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
        times = multiDimensionalUnique(timesInfo);

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
          eventInfo += `<th class="timeslot">${formatDate(new Date(time.start))} <br> ${formatDate(new Date(time.end))}</th>`
        })
        eventInfo += `</tr>`;

        // Load every attendees with their availability
        attendees.forEach((attendee) => {
          eventInfo += `<tr><td data-attendee-id=${attendee.id}>${attendee.name} <br> ${attendee.email}<i class="fas fa-user-edit"></i></td>`;

          times.forEach((time) => {
            eventInfo += `<td class="notAvailable" data-time-id=${time.id} data-attendee-id=${attendee.id}></td>`
          })
          eventInfo += `</tr>`;
        })

        eventInfo += `<td colspan="3" class="addAttendee"><i class="fas fa-plus"></i></td>`

        $(".time-slots").append(eventInfo);
        eventInfo = '';

        timesAttendees.forEach((availability) => {
          $(`td[data-time-id = ${availability.time_id}][data-attendee-id = ${availability.attendee_id}]`).toggleClass('notAvailable available');
        })
      });
  }

  // Add new attendees to the event page
  $('.event-details').on('click', '.fa-plus', function (e) {
    $(this).parent('.addAttendee').remove();
    let eventInfo = `<tr><td><input class="new-attendee" type="text" name="newName" placeholder="Name">
      </input><br><input class="new-attendee" type="text" name="newEmail" placeholder="Email"></input>
        <i class="fas fa-user-plus"></i></td>`;

    times.forEach((time) => {
      eventInfo += `<td class="newAvailability notAvailable" data-time-id="${time.id}"></td>`
    });

    eventInfo += `</tr><td colspan="3" class="addAttendee"><i class="fas fa-plus"></i></td>`;

    $(".time-slots").append(eventInfo);
  });

  // Make the selected user editable and change the icon to a user check
  $('.event-details').on('click', '.fa-user-edit', function (e) {
    $(this).toggleClass('fa-user-edit fa-user-check');
    console.log($(this).parent().siblings().addClass(`newAvailability`));
  })

  // When you click on an editable table cell (either through new user or edit user) toggle the classes
  $('.event-details').on('click', '.newAvailability', function (e) {
    e.preventDefault();
    $(this).toggleClass('notAvailable available');
  });


  $('.event-details').on('click', '.fa-user-plus', function (e) {
    e.preventDefault();
    // Add a new attendee to the db and refresh the page with times, attendees, times_attendees tables
  });

  $('.event-details').on('click', '.fa-user-check', function (e) {
    e.preventDefault();
    // Only modify times_attendees table
  })
});
