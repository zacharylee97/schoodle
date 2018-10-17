
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
    })
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('events'),
    knex.schema.dropTable('attendees')
  ]);
};
