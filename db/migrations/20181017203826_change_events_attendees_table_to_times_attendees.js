
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('events_attendees', table => {
      table.renameColumn('events_id', 'times_id')
    }),
    knex.schema.renameTable('events_attendees', 'times_attendees')
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('times_attendees', table => {
      table.renameColumn('times_id', 'events_id')
    }),
    knex.schema.renameTable('times_attendees', 'events_attendees')
  ])
};
