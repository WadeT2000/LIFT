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
    last_name: `Schwarz`,
    patient_id: num(0, 9999999999),
    casualty_event: `CANCER`,
    requirements: '1L',
    attendants: 0,
    originating_mtf: `LANDSTUHL REGIONAL MED CTR GE`,
    destination_mtf: `WAMC, FT BRAGG, NC (PRC)`,
    primary_med_spec: faker.person.fullName(),
    primary_diagnosis: `COLLAPSED LUNG`,
    secondary_diagnosis: 'None',
    other_diagnosis: 'None',
    eps: 'KADW',
    dds: `KPOB` ,
    upr: `Routine`,
    age: num(17, 40),
    gender: faker.person.gender(),
    passenger_weight: num(85, 350),
    grade: grade(),
    equipment: 'N',
    diet: 'Fluids only',
    max_alt: `None`,
    spec: `N` ,
    special_team: `None`,
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
    {...patientTemplate(), last_name: 'Petersen', requirements: '1A'},
    {...patientTemplate(), last_name: 'Sugar', upr: 'Urgent', destination_mtf: `375th MED GRP SCOTT AFB IL`, dds: `KSKF`},
    {...patientTemplate(), last_name: 'Lain', upr: 'Urgent', destination_mtf: `379 MED GRP AL UDEID AB`, dds: `OTBH`},
    {...patientTemplate(), last_name: 'Degraph', requirements: '1A', destination_mtf: `20th MED GRP SHAW AFB SC`, dds: `KSSC`},
    {...patientTemplate(), last_name: 'Enried', requirements: '1A', attendants: 1, upr: 'Routine', destination_mtf: `20th MED GRP SHAW AFB SC`, dds: `KSSC`},
    {...patientTemplate(), last_name: 'Bertha', requirements: '1A', attendants: 1, upr: 'Routine', destination_mtf: `18th MED GRP KADENA AB`, dds: `RODN`},
    {...patientTemplate(), last_name: 'Smith', upr: 'Routine', destination_mtf: `99th MED GRP NELLIS AFB NV`, dds: `KLSV`},
    {...patientTemplate(), last_name: 'Johnson', requirements: '2B', destination_mtf: `60th MED GRP TRAVIS AFB CA`, dds: `KSUU`},
    {...patientTemplate(), last_name: 'Williams', upr: 'Urgent', destination_mtf: `86th MED GRP RAMSTEIN AB`, dds: `ETAR`},
    {...patientTemplate(), last_name: 'Brown', requirements: '1B', attendants: 2, upr: 'Priority', destination_mtf: `52nd MED GRP SPANGDAHLEM AB`, dds: `ETAD`},
    {...patientTemplate(), last_name: 'Davis', upr: 'Routine', destination_mtf: `6th MED GRP MACDILL AFB FL`, dds: `KMCF`},
    {...patientTemplate(), last_name: 'Miller', requirements: '1A', upr: 'Routine', destination_mtf: `48th MED GRP RAF LAKENHEATH`, dds: `EGUL`},
    {...patientTemplate(), last_name: 'Wilson', requirements: '2C', upr: 'Urgent', destination_mtf: `51st MED GRP OSAN AB`, dds: `RKSO`},
    {...patientTemplate(), last_name: 'Moore', attendants: 1, upr: 'Routine', destination_mtf: `18th MED GRP KADENA AB`, dds: `RODN`},
    {...patientTemplate(), last_name: 'Taylor', requirements: '1B', upr: 'Priority', destination_mtf: `48th MED GRP RAF LAKENHEATH`, dds: `EGUL`},
    {...patientTemplate(), last_name: 'Anderson', requirements: '2A', upr: 'Urgent', destination_mtf: `20th MED GRP SHAW AFB SC`, dds: `KSSC`},
    {...patientTemplate(), last_name: 'Thomas', upr: 'Routine', destination_mtf: `31st MED GRP AVIANO AB`, dds: `LIPA`},
    {...patientTemplate(), last_name: 'Jackson', requirements: '3A', attendants: 1, upr: 'Priority', destination_mtf: `99th MED GRP NELLIS AFB NV`, dds: `KLSV`},
    {...patientTemplate(), last_name: 'White', upr: 'Urgent', destination_mtf: `81st MED GRP KEESLER AFB MS`, dds: `KBIX`},
    {...patientTemplate(), last_name: 'Harris', requirements: '1A', upr: 'Routine', destination_mtf: `15th MED GRP JOINT BASE PEARL HARBOR-HICKAM`, dds: `PHIK`},
    {...patientTemplate(), last_name: 'Martin', upr: 'Priority', destination_mtf: `86th MED GRP RAMSTEIN AB`, dds: `ETAR`},
    {...patientTemplate(), last_name: 'Thompson', requirements: '2B', upr: 'Urgent', destination_mtf: `51st MED GRP OSAN AB`, dds: `RKSO`},
    {...patientTemplate(), last_name: 'Garcia', attendants: 2, upr: 'Routine', destination_mtf: `31st MED GRP AVIANO AB`, dds: `LIPA`},
    {...patientTemplate(), last_name: 'Martinez', requirements: '1B', upr: 'Priority', destination_mtf: `60th MED GRP TRAVIS AFB CA`, dds: `KSUU`},
    {...patientTemplate(), last_name: 'Robinson', upr: 'Routine', destination_mtf: `20th MED GRP SHAW AFB SC`, dds: `KSSC`},
    {...patientTemplate(), last_name: 'Clark', requirements: '2C', upr: 'Urgent', destination_mtf: `86th MED GRP RAMSTEIN AB`, dds: `ETAR`},
    {...patientTemplate(), last_name: 'Rodriguez', upr: 'Routine', destination_mtf: `18th MED GRP KADENA AB`, dds: `RODN`},
    {...patientTemplate(), last_name: 'Lewis', requirements: '3A', attendants: 1, upr: 'Priority', destination_mtf: `15th MED GRP JOINT BASE PEARL HARBOR-HICKAM`, dds: `PHIK`},
    {...patientTemplate(), last_name: 'Lee', upr: 'Urgent', destination_mtf: `48th MED GRP RAF LAKENHEATH`, dds: `EGUL`},
    {...patientTemplate(), last_name: 'Walker', requirements: '1A', upr: 'Routine', destination_mtf: `60th MED GRP TRAVIS AFB CA`, dds: `KSUU`},
    {...patientTemplate(), last_name: 'Hall', upr: 'Priority', destination_mtf: `6th MED GRP MACDILL AFB FL`, dds: `KMCF`},
    {...patientTemplate(), last_name: 'Allen', requirements: '2B', upr: 'Urgent', destination_mtf: `20th MED GRP SHAW AFB SC`, dds: `KSSC`},
    {...patientTemplate(), last_name: 'Young', attendants: 2, upr: 'Routine', destination_mtf: `51st MED GRP OSAN AB`, dds: `RKSO`},
    {...patientTemplate(), last_name: 'Hernandez', requirements: '1B', upr: 'Priority', destination_mtf: `379 MED GRP AL UDEID AB`, dds: `OTBH`},
    {...patientTemplate(), last_name: 'King', upr: 'Routine', destination_mtf: `81st MED GRP KEESLER AFB MS`, dds: `KBIX`},

  ]);
};

