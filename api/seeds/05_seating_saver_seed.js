/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('patient_seatings').del()
    .then(function () {
      // Inserts seed entries
      return knex('patient_seatings').insert([
        {patient_id: 1, seat_type: 'Ambulatory', seat_location: 'Left Ambulatory_0'},
        {patient_id: 2, seat_type: 'Litter', seat_location: 'Left Litter_0'},
        {patient_id: 3, seat_type: 'Ambulatory', seat_location: 'Right Ambulatory_1'},
      ]);
    });
};
