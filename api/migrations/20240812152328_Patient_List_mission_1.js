/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('patient_mission_1', table => {
    table.increments();
    table.string('first_name', 100);
    table.string('last_name', 100);
    table.bigInteger('patient_id');
    table.string('casualty_event', 250);
    table.string('requirements', 250);
    table.integer('attendants', 250);
    table.string('originating_mtf', 250);
    table.string('destination_mtf', 250);
    table.string('primary_med_spec', 250);
    table.string('primary_diagnosis', 250);
    table.string('secondary_diagnosis', 250);
    table.string('other_diagnosis', 250);
    table.string('eps', 100);
    table.string('dds', 100);
    table.string('upr', 100);
    table.integer('age');
    table.string('gender', 100);
    table.integer('passenger_weight');
    table.string('grade', 100);
    table.string('equipment', 100);
    table.string('diet', 100);
    table.string('max_alt', 100);
    table.string('spec', 100);
    table.string('special_team', 100);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('patient_mission_1');
};
