
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('times', function (table) {
      table.increments('id').primary();
      table.integer('events_id');
      table.foreign('events_id').references('id').inTable('events').onDelete('cascade');
      table.datetime('time_start');
      table.datetime('time_end');
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('times')
  ]);
};
