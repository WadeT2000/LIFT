/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('load_plan', table => {
    table.increments();
    table.string('lp_name');
    table.json('amb_left').notNullable();
    table.json('lit_left').notNullable();
    table.json('amb_right').notNullable();
    table.json('lit_right').notNullable();
    table.json('stops_order').notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('load_plan')
};
