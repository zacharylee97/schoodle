
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('events_attendees', function (table) {
      table.integer('events_id');
      table.integer('attendees_id');
      table.foreign('events_id').references('id').inTable('events').onDelete('cascade');
      table.foreign('attendees_id').references('id').inTable('attendees').onDelete('cascade');
      table.datetime('time_start');
      table.datetime('time_end');
      table.timestamps(true, true);
    })
  ])
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('events_attendees')
  ])
};
