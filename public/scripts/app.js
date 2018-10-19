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
          attendeesInfo.push([attendee.name, attendee.email, attendee.attendees_id]);
        });
        var attendees = multiDimensionalUnique(attendeesInfo);

        //Filter through the events times
        const timesInfo = [];
        result.forEach(function (time) {
          timesInfo.push([time.time_start, time.time_end]);
        });
        var times = multiDimensionalUnique(timesInfo);

        // Takes every connection between times and attendees
        const timesAttendees = [];
        result.forEach(function (availability) {
          timesAttendees.push([availability.times_id, availability.attendees_id]);
        });
        // Load timeslots 
        var eventInfo = `<tr><th></th>`
        times.forEach((time) => {
          eventInfo += `<th>${time[0]} <br> ${time[1]}</th>`
        })
        eventInfo += `</tr>`;

        // Load every attendees with their availability
        attendees.forEach((attendee) => {
          eventInfo += `<tr><td>${attendee[0]} <br> ${attendee[1]}</td>`;

          timesAttendees.forEach((availability) => {
            eventInfo += `<td>`;

            if (availability[1] == attendee[2]) {
              eventInfo += `Going!`;
            }
            eventInfo += `</td>`;
          })
          eventInfo += `</tr>`;
        })
        $(".time-slots").append(eventInfo);
      });
  }

  $('.calendar').on('click', '.calendarCell', function () {
    $(this).toggleClass('calendarSelectedCell');
    // $(this).parents().siblings('.times').text($(this).text());
    // $(this).parents().siblings('.times').slideToggle();

  });
});
