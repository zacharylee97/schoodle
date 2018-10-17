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
        }),
      knex('attendees')
        .insert({
          name: req.body.name,
          email: req.body.email
        })
        .then((result) => {
          res.json(result);
        })
    ])
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