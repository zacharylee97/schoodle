// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });

$(function() {
  //Onclick function for create-new-event button
  $("button").click(function() {
    window.location.href="/event/new";
  });
});
