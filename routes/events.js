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

  function insertTimes(timeslot) {
    return Promise.all([
      knex('events').max('id')
        .then(eventsid => {
          return knex('times')
            .insert({
              events_id: eventsid[0]['max'],
              time_start: new Date(timeslot.date + ' ' + timeslot.time_start),
              time_end: new Date(timeslot.date + ' ' + timeslot.time_end)
            }, 'id')
        }).then(([timesID]) => {
          return knex('attendees').max('id').then(attendeesid => {
            return knex('times_attendees')
              .insert({
                times_id: timesID,
                attendees_id: attendeesid[0]['max']
              })
          })
        })
    ]);
  }

  function modifyAvailability(availability) {
    console.log(availability);
    if (availability.going == 'true') {
      console.log(`Added to db! Going: ${availability.going}, times_id: ${availability.times_id}, attendees_id: ${availability.attendees_id}`);
      knex('times_attendees')
        .where({
          times_id: availability.times_id,
          attendees_id: availability.attendees_id
        })
        .update({
          going: true
        }).then(() => {
          console.log(`Success for going`);
        })
    }
    if (availability.going == 'false') {
      console.log(`Removed from db! Going: ${availability.going}, times_id: ${availability.times_id}, attendees_id: ${availability.attendees_id}`);
      // Need to update this here!
      knex('times_attendees')
        .where({
          times_id: availability.times_id,
          attendees_id: availability.attendees_id
        })
        .update({
          going: false
        }).then(() => {
          console.log(`Success for not going`);
        })
    }
  }

  // Modify a specific event's attendees and their availability
  router.post("/:unique_url", (req, res) => {
    console.log(req.body);
    return Promise.all([
      req.body.times_attendees.forEach((availability) => {
        modifyAvailability(availability);
      })
    ]).then(() => {
      res.redirect(`${req.body.unique_url}`)
    })
  })

  // Post new event
  router.post("/", (req, res) => {
    const times = req.body.times;
    return Promise.all([
      knex('events')
        .insert({
          title: req.body.title,
          description: req.body.description,
          unique_url: req.body.unique_url
        })
        .then(() => {
          return knex('attendees')
            .insert({
              name: req.body.name,
              email: req.body.email
            })
        })
        .then(() => {
          times.forEach(function (timeslot) {
            insertTimes(timeslot);
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
      'times_attendees.going'
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


