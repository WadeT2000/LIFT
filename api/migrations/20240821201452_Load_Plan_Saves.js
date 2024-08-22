/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('load_plan', table => {
    table.increments();
    table.string('lp_name');
    table.json('occupied_seats').notNullable();
    table.json('stops_order').notNullable();
    table.json('plane').notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('load_plan')
};
