const { faker } = require('@faker-js/faker');

const num = (min, max) => Math.floor(Math.random()*(max-min+1)+min)
const grade = () => {
  const grades = [`E01`, `E02`, `E03`, `E04`, `E05`, `E06`, `E07`, `E08`, 
                  `O01`, `O02`, `O03`, `O04`, `O05`, `O06`
  ]
  return grades[num(0, grades.length)]
}


const attendantTemplate = () => {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    gender: faker.person.gender(),
    age: num(17, 40),
    grade: grade(),
    enplane: 'KADW',
    passenger_weight: num(85, 250),
    created_on: 'Lo-Side',   
  }
}


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('attendant_mission_1').del()
  await knex('attendant_mission_1').insert([
    {...attendantTemplate(), patient_id: 1, deplane: 'KSSC', attendant_specialty: 'Medical'},
    {...attendantTemplate(), patient_id: 6, deplane: 'KSSC', attendant_specialty: 'Medical'},
    {...attendantTemplate(), patient_id: 7, deplane: 'RODN', attendant_specialty: 'Medical'},
    {...attendantTemplate(), patient_id: 11, deplane: 'ETAD', attendant_specialty: 'Medical'},
    {...attendantTemplate(), patient_id: 11, deplane: 'ETAD', attendant_specialty: 'Medical'},
    {...attendantTemplate(), patient_id: 15, deplane: 'RODN', attendant_specialty: 'Medical'},
    {...attendantTemplate(), patient_id: 19, deplane: 'KLAV', attendant_specialty: 'Medical'},
    {...attendantTemplate(), patient_id: 24, deplane: 'LIPA', attendant_specialty: 'Medical'},
    {...attendantTemplate(), patient_id: 24, deplane: 'LIPA', attendant_specialty: 'Medical'}, 
    {...attendantTemplate(), patient_id: 29, deplane: 'PHIK', attendant_specialty: 'Medical'},
    {...attendantTemplate(), patient_id: 34, deplane: 'RKSO', attendant_specialty: 'Medical'},
    {...attendantTemplate(), patient_id: 34, deplane: 'RKSO', attendant_specialty: 'Medical'},
  ]);
};
