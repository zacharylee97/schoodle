$(() => {
  function generateRandomString(lengthURL) {
    const possibleChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let randomURL = "";
    for (var i = 0; i < lengthURL; i++) {
      randomURL += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }
    return randomURL;
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
      console.log(result);
      //Display event details
      const title = result[0].title;
      const description = result[0].description;
      const eventDetails =
      `<h1>Event Details</h1>
      <p>Event title: ${title}</p>
      <p>Event description: ${description}</p>`;
      $(".event-details").prepend(eventDetails);

      //Display participants
      const names = [];
      result.forEach(function(element) {
        names.push(element.name);
      });
      const attendees = [...new Set(names)];

      // Load timeslots table for event
      let timeslots =
      `<tr>
          <th></th>
          <th>Oct 18 Thu</th>
          <th>Oct 19 Fri</th>
          <th>Oct 20 Sat</th>
        </tr>
      `;
      $(".time-slots").append(timeslots);

      attendees.forEach(function(element) {
      let newAttendee =
      `<tr>
        <td>${element}</td>
        <td><input type="checkbox"></td>
        <td><input type="checkbox"></td>
        <td><input type="checkbox"></td>
      </tr>`
      $(".time-slots").append(newAttendee);
      });
    });
  }
  $('.calendar').on('click', '.calendarCell', function () {
    $(this).toggleClass('calendarSelectedCell');
  });
});
