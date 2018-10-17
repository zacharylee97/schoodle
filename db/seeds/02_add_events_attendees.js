
exports.seed = function(knex, Promise) {
  return knex('events_attendees')
      .del()
      .then(function () {
        return knex('events_attendees').insert([
          { events_id: 1, attendees_id: 1, time_start: '2018-08-11 18:00:00', time_end: '2018-08-11 21:00:00' },
          { events_id: 1, attendees_id: 1, time_start: '2018-08-12 19:00:00', time_end: '2018-08-12 21:00:00' },
          { events_id: 1, attendees_id: 2, time_start: '2018-08-11 18:00:00', time_end: '2018-08-11 21:00:00' },
          { events_id: 1, attendees_id: 3, time_start: '2018-08-11 18:00:00', time_end: '2018-08-11 21:00:00' },
          { events_id: 2, attendees_id: 1, time_start: '2018-09-01 15:00:00', time_end: '2018-09-01 21:00:00' },
          { events_id: 2, attendees_id: 3, time_start: '2018-09-01 15:00:00', time_end: '2018-09-01 21:00:00' },
          { events_id: 3, attendees_id: 1, time_start: '2018-09-15 18:00:00', time_end: '2018-09-16 03:00:00' },
          { events_id: 3, attendees_id: 2, time_start: '2018-09-15 18:00:00', time_end: '2018-09-16 03:00:00' },
          { events_id: 3, attendees_id: 3, time_start: '2018-09-16 18:00:00', time_end: '2018-09-17 03:00:00' },
        ])
      })
};
