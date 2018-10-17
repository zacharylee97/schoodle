const randomUrlId = require('../../public/scripts/randomId');

exports.seed = function (knex, Promise) {
  return Promise.all([
    knex.raw('ALTER SEQUENCE events_id_seq RESTART WITH 1'),
    knex.raw('ALTER SEQUENCE attendees_id_seq RESTART WITH 1'),
    knex('events')
      .del()
      .then(function () {
        return knex('events').insert([
          { title: "Let's get Beer", description: "Let's drink the night away!", unique_url: randomUrlId(12) },
          { title: "Let's go Hiking", description: "Let's have fun in a mountain", unique_url: randomUrlId(12) },
          { title: "Let's Chill", description: "Just chilling", unique_url: randomUrlId(12) }
        ])
      }),
    knex('attendees')
      .del()
      .then(function () {
        return knex('attendees').insert([
          { name: 'Bob', email: "Bob@bob.com" },
          { name: 'Alice', email: "Ali@Ali.com" },
          { name: 'Charlie', email: "Cha@Cha.com" },
          { name: 'Timothy', email: "Tim@tim.com" }
        ])
      })
  ]);
};
