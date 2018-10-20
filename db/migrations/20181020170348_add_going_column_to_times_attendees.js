
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('times_attendees', table => {
      table.boolean('going').defaultTo(true);
    })
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('times_attendees', table => {
      table.dropColumn('going');
    })
  ]);
};
