"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {
  // Create new event page
  router.get("/new", (req, res) => {
    res.render("new-event");
  });

  // Event page
  router.get("/:unique_url", (req, res) => {
    res.render("event");
  });
  // Post new event
  router.post("/", (req, res) => {
    const dateStart = new Date(req.body.time_start);
    const dateEnd = new Date(req.body.time_end);
    const timeStart =
      [dateStart.getMonth() + 1,
      dateStart.getDate(),
      dateStart.getFullYear()].join('-') + ' ' +
      [dateStart.getHours(),
      dateStart.getMinutes(),
      dateStart.getSeconds()].join(':');
    const timeEnd =
      [dateEnd.getMonth() + 1,
      dateEnd.getDate(),
      dateEnd.getFullYear()].join('-') + ' ' +
      [dateEnd.getHours(),
      dateEnd.getMinutes(),
      dateEnd.getSeconds()].join(':');

    return Promise.all([
      knex('events')
        .insert({
          title: req.body.title,
          description: req.body.description,
          unique_url: req.body.unique_url
        }, 'id')
        .then(([foreignEventsId]) => {
          return knex('times')
            .insert({
              events_id: foreignEventsId,
              time_start: timeStart,
              time_end: timeEnd
            })
        })
        .then(() => {
          return knex('attendees')
            .insert({
              name: req.body.name,
              email: req.body.email
            })
        })
        .then(() => {
          return knex('times').max('id').then(timesid => {
            return knex('attendees').max('id').then(attendeesid => {
              return knex('times_attendees')
                .insert({
                  times_id: timesid[0]['max'],
                  attendees_id: attendeesid[0]['max']
              })
            })
          })
        })
    ])
      .catch(err => {
        console.error(err)
      })
      .then((re) => {
        res.json(re);
      })
  });
  //Retrieve info from database
  router.get("/:unique_url/info", (req, res) => {
    return knex.select().from('events')
      .join('times', 'events.id', 'times.events_id')
      .join('times_attendees', 'times.id', 'times_attendees.times_id')
      .join('attendees', 'attendees.id', 'times_attendees.attendees_id')
      .where('unique_url', req.params.unique_url)
      .then((result) => {
        res.json(result);
      })
      .catch(err => {
        console.error(err)
      });
    });

  return router;
}
