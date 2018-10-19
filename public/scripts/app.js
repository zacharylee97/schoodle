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


  var arr = [[7, 3], [7, 3], [3, 8], [7, 3], [7, 3], [1, 2]];

  multiDimensionalUnique(arr);

  function checkForm() {
    if ($('[name=title]').val() && $('[name=description]').val() && $('[name=name]').val() && $('[name=email]').val()) {
      return true;
    } else {
      return false;
    }
  }

<<<<<<< HEAD
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
      }
    }
  });

=======
>>>>>>> feature/event
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
        result.forEach(function (element) {
          attendeesInfo.push([element.name, element.email]);
        });
        var attendees = multiDimensionalUnique(attendeesInfo);
        
        //Filter through the events times
        const timesInfo = [];
        result.forEach(function (element) {
          timesInfo.push([element.time_start, element.time_end]);
        });
        var times = multiDimensionalUnique(timesInfo);
        
      //   // Load timeslots table for event
      //   let timeslots =
      //     `<tr>
      //     <th></th>
      //     <th>Oct 18 Thu</th>
      //     <th>Oct 19 Fri</th>
      //     <th>Oct 20 Sat</th>
      //   </tr>
      // `;
      //   $(".time-slots").append(timeslots);

      //   attendees.forEach(function (element) {
      //     let newAttendee =
      //       `<tr>
      //   <td>${element}</td>
      //   <td><input type="checkbox"></td>
      //   <td><input type="checkbox"></td>
      //   <td><input type="checkbox"></td>
      // </tr>`
      //     $(".time-slots").append(newAttendee);
      //   });
      });
  }
<<<<<<< HEAD
=======

  $('.calendar').on('click', '.calendarCell', function () {
    $(this).toggleClass('calendarSelectedCell');
    // $(this).parents().siblings('.times').text($(this).text());
    // $(this).parents().siblings('.times').slideToggle();

  });
>>>>>>> feature/event
});
