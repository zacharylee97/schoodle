
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('times_attendees', function (table) {
      table.integer('times_id');
      table.integer('attendees_id');
      table.foreign('times_id').references('id').inTable('times').onDelete('cascade');
      table.foreign('attendees_id').references('id').inTable('attendees').onDelete('cascade');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('times_attendees')
  ]);
};
