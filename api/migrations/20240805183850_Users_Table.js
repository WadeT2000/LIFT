/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('first_name', 250);
    table.string('last_name', 250);
    table.string('username', 250).notNullable().unique();
    table.string('password', 2500);
    table.string('auth_token', 500);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
