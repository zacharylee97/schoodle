$(() => {
  console.log('document ready');
  function generateRandomString(lengthURL) {
    const possibleChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let randomURL = "";
    for (var i = 0; i < lengthURL; i++) {
      randomURL += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }
    return randomURL;
  }


  $('.new-event-form').on('submit', function (e) {
    e.preventDefault();
    let uniqueUrl = generateRandomString(12);
    console.log(uniqueUrl);
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
    }).done((url) => {
      window.location.href = `/events/${url}`;
    });;
  })

  //Onclick function for create-new-event button
  $("#new-event-btn").click(function () {
    window.location.href = "/events/new";
  });
});
