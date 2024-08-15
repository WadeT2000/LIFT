/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('patient_seatings', function(table) {
    table.increments('id').primary();
    table.integer('patient_id').unsigned().references('patients.id');
    table.string('seat_type');  // will be for 'ambulatory' or 'litter'
    table.string('seat_location');  //will be specified for example, 'Left Ambulatory_0'
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('patient_seatings');
};
