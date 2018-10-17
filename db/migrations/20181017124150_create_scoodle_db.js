
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('events', function (table) {
      table.increments('id').primary();
      table.string('title');
      table.string('description');
      table.string('unique_url');
    }),
    knex.schema.createTable('attendees', function (table) {
      table.increments('id').primary();
      table.string('name');
      table.string('email');
<<<<<<< HEAD
=======
    }),
    knex.schema.createTable('events_attendees', function (table) {
      table.foreign('events_id').references('id').inTable('events');
      table.foreign('attendees_id').references('id').inTable('attendees');
      table.date('time_start');
      table.date('time_end');
>>>>>>> a3b00b98a416469816b5f6b7384b7925fc9c7e9e
    })
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('events'),
<<<<<<< HEAD
    knex.schema.dropTable('attendees')
=======
    knex.schema.dropTable('attendees'),
    knex.schema.dropTable('events_attendees')
>>>>>>> a3b00b98a416469816b5f6b7384b7925fc9c7e9e
  ]);
};
