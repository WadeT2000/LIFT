const bcrypt = require('bcryptjs');

const hashme = async (pass) => {
  return await bcrypt.hash(pass, 10)
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  const password = await hashme('12345')
  await knex.schema.raw('TRUNCATE users CASCADE')
  await knex('users').del()
  await knex('users').insert([
    {first_name: 'Wade', last_name: 'Wilson', username: 'Deadpool', password: password, auth_token: ''},
    {first_name: 'Peter', last_name: 'Parker', username: 'Spiderman', password: password, auth_token: ''},
    {first_name: 'Clark', last_name: 'Kent', username: 'Superman', password: password, auth_token: ''}
  ]);
};
