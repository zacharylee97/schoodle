
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('times_attendees', table => {
      table.dropColumn('time_start');
      table.dropColumn('time_end');
      table.dropTimestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('times_attendees', table => {
      table.addColumn('time_start');
      table.addColumn('time_end');
      table.timestamps(true, true);
    })
  ]);
};
