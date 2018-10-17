
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('events_attendees', function (table) {
      table.foreign('events_id').references('id').inTable('events');
      table.foreign('attendees_id').references('id').inTable('attendees');
      table.date('time_start');
      table.date('time_end');
    })
  ])
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('events_attendees')
  ])
};
