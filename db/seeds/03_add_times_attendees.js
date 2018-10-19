
exports.seed = function (knex, Promise) {
  return knex('times_attendees')
    .del()
    .then(function () {
      return knex('times_attendees').insert([
        { times_id: 1, attendees_id: 1 },
        { times_id: 1, attendees_id: 2 },
        { times_id: 1, attendees_id: 3 },
        { times_id: 2, attendees_id: 1 },
        { times_id: 3, attendees_id: 1 },
        { times_id: 3, attendees_id: 3 },
        { times_id: 4, attendees_id: 1 },
        { times_id: 4, attendees_id: 2 },
        { times_id: 4, attendees_id: 3 }
      ])
    })
};
