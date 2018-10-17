"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {
  // Post new event
  router.post("/", (req, res) => {
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
              time_start: req.body.time_start,
              time_end: req.body.time_end
            })
        }),
      knex('attendees')
        .insert({
          name: req.body.name,
          email: req.body.email
        })
    ])
      .catch(err => {
        console.error(err)
      })
      .then((re) => {
        res.json(re);
      })
  });

  // Create new event page
  router.get("/new", (req, res) => {
    res.render("new-event");
  });

  // Event page
  router.get("/:unique_url", (req, res) => {
    res.render("event");
  });

  return router;
}