"use strict";

const express = require('express');
const router = express.Router();

const formatDate = require('../formatDate')

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
    const times = req.body.times;
    times.forEach(function(timeslot) {

    })
    const timeStart = formatDate(new Date());
    const timeEnd = formatDate(new Date());

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

  //Retrieve event info from database
  router.get("/:unique_url/info", (req, res) => {
    return knex.select([
      'attendees.id as attendees_id',
      'times.id as times_id',
      'events.id as events_id',
      'times.time_start',
      'times.time_end',
      'events.title',
      'events.description',
      'attendees.name',
      'attendees.email',
    ]).from('events')
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
