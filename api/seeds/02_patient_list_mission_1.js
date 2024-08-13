const { faker } = require('@faker-js/faker');

const num = (min, max) => Math.floor(Math.random()*(max-min+1)+min)
const grade = () => {
  const grades = [`E01`, `E02`, `E03`, `E04`, `E05`, `E06`, `E07`, `E08`, 
                  `O01`, `O02`, `O03`, `O04`, `O05`, `O06`
  ]
  return grades[num(0, grades.length)]
}


const patientTemplate = () => {
  return {
    first_name: faker.person.firstName(),
    //last_name: `Schwarz`,
    patient_id: num(0, 9999999999),
    casualty_event: `CANCER`,
    //Requirements: ,
    originating_mtf: `LANDSTUHL REGIONAL MED CTR GE`,
    destination_mtf: `WAMC, FT BRAGG, NC (PRC)`,
    primary_med_spec: faker.person.fullName(),
    primary_diagnosis: `COLLAPSED LUNG`,
    secondary_diagnosis: 'None',
    other_diagnosis: 'None',
    eps: 'KADW',
    dds: `KPOB` ,
    // upr: `Routine`,
    age: num(17, 40),
    gender: faker.person.gender(),
    passenger_weight: num(85, 350),
    grade: grade(),
    equipment: 'N',
    diet: 'Fluids only',
    max_alt: `None`,
    spec: `N` ,
    special_team: `None`
  }
}

const patient2Template = () => {
  return {
    first_name: faker.person.firstName(),
    //last_name: `Schwarz`,
    patient_id: num(0, 9999999999),
    casualty_event: `CANCER`,
    //Requirements: ,
    originating_mtf: `LANDSTUHL REGIONAL MED CTR GE`,
    destination_mtf: `20th MED GRP SHAW AFB SC`,
    primary_med_spec: faker.person.fullName(),
    primary_diagnosis: `COLLAPSED LUNG`,
    secondary_diagnosis: 'None',
    other_diagnosis: 'None',
    eps: 'KADW',
    dds: `KSSC`,
    // upr: `Routine`,
    age: num(17, 40),
    gender: faker.person.gender(),
    passenger_weight: num(85, 350),
    grade: grade(),
    equipment: 'N',
    diet: 'Fluids only',
    max_alt: `None`,
    spec: `N` ,
    special_team: `None`
  }
}

const patient3Template = () => {
  return {
    first_name: faker.person.firstName(),
    //last_name: `Schwarz`,
    patient_id: num(0, 9999999999),
    casualty_event: `CANCER`,
    //Requirements: ,
    originating_mtf: `LANDSTUHL REGIONAL MED CTR GE`,
    destination_mtf: `375th MED GRP SCOTT AFB IL`,
    primary_med_spec: faker.person.fullName(),
    primary_diagnosis: `COLLAPSED LUNG`,
    secondary_diagnosis: 'None',
    other_diagnosis: 'None',
    eps: 'KADW',
    dds: `KSKF`,
    // upr: `Routine`,
    age: num(17, 40),
    gender: faker.person.gender(),
    passenger_weight: num(85, 350),
    grade: grade(),
    equipment: 'N',
    diet: 'Fluids only',
    max_alt: `None`,
    spec: `N` ,
    special_team: `None`
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('patient_mission_1').del()
  await knex('patient_mission_1').insert([
    {first_name: 'Randy', last_name: 'Rhodes', patient_id: 12345678910, casualty_event: 'OIR-Disease/NON-BI', requirements: '1A', attendants: 1, originating_mtf: 'Landstuhl Regional Medical Center', destination_mtf: '20th Med Group Shaw AFB', primary_med_spec: 'MPSA-Alcohol Rehabilitation', primary_diagnosis: 'F1020-ALC DEPENDENCE, UNCOMPLICATED', secondary_diagnosis: 'None', other_diagnosis: 'None', eps: 'KADW',  dds: 'KSSC', upr: 'Routine', age: 45, gender: 'Male', passenger_weight: 270, grade: 'E06', equipment: 'N', diet: 'Fluids only', max_alt: 'None', spec: 'N', special_team: 'None'},
    {...patient2Template(), last_name: 'Pepper', requirements: '1A', attendants: 0, upr: 'Routine'},
    {...patientTemplate(), last_name: 'Salt', requirements: '1L', attendants: 0, upr: 'Urgent'},
    {...patient3Template(), last_name: 'Oregano', requirements: '1A', attendants: 0, upr: 'Routine'},
    {...patientTemplate(), last_name: 'Sugar', requirements: '1A', attendants: 1, upr: 'Routine'},
  ]);
};

