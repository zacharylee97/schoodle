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

  function checkForm() {
    if ($('[name=title]').val() && $('[name=description]').val() && $('[name=name]').val() && $('[name=email]').val()) {
      return true;
    } else {
      return false;
    }
  }

  //Display time slots when date is selected on calendar
  $('.calendar').on('click', '.calendarCell', function () {
    if ($(this).hasClass('calendarOutsideMonth')) {
    } else {
      $(this).toggleClass('calendarSelectedCell');
      let $date = $(this).text();
      if ($('p').hasClass($date)) {
        $(`.${$date}`).remove();
      } else {
      $(this).parents().siblings('.times')
        .append(`<p class="${$date}">${$date}</p>`);
      $(".submit").css("display", "block");
      }
    }
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
        const title = result[0].title;
        const description = result[0].description;
        const eventDetails = `
          <h1>Event Details</h1>
          <p>Event title: ${title}</p>
          <p>Event description: ${description}</p>`;

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
          eventInfo += `<th>${time.start} <br> ${time.end}</th>`
        })
        eventInfo += `</tr>`;

        // Load every attendees with their availability
        attendees.forEach((attendee) => {
          eventInfo += `<tr><td>${attendee.name} <br> ${attendee.email}</td>`;

          timesAttendees.forEach((availability) => {
            eventInfo += `<td>`;
            if (availability.attendee_id == attendee.id) {
              eventInfo += `Going!`;
            }

            eventInfo += `</td>`;
          })

          eventInfo += `</tr>`;
        })
        $(".time-slots").append(eventInfo);
      });
  }
});
