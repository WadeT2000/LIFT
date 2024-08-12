/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('attendant_mission_1').del()
  await knex('attendant_mission_1').insert([
    {patient_last_name: 'Rhodes', first_name: 'Timmy', last_name: 'Times', enplane: 'KADW', deplane: 'KSSC', age: 28, gender: 'Male', passenger_weight: 183, grade: 'E06', created_on: 'Lo-Side'},
    {patient_last_name: 'Sugar', first_name: 'Mary', last_name: 'Poppins', enplane: 'KADW', deplane: 'KPOB', age: 25, gender: 'Female', passenger_weight: 120, grade: 'E05', created_on: 'Lo-Side'},
  ]);
};
