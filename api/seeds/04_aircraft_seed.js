/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('aircraft').del()
  await knex('aircraft').insert([
    {ac_name: 'C-17', ambulatory_left: 27, ambulatory_right: 27, litter_left: 18, litter_right: 18},
    {ac_name: 'C-130J', ambulatory_left: 31, ambulatory_right: 31, litter_left: 30, litter_right: 30},
  ]);
};
