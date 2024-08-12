/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('aircraft', table => {
    table.increments();
    table.string('ac_name', 250);
    table.integer('ambulatory_left');
    table.integer('ambulatory_right');
    table.integer('litter_left');
    table.integer('litter_right');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('aircraft')
};
