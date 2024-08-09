const express = require('express');
const app = express();
const port = process.env.port || 8080;
const cors = require('cors')

const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || "development"]);

// app.use(express.json());

app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json('My API is up and running!')
})

app.get('/testingtable', (req, res) => {
    knex('first_table')
    .select('*')
    .then(data => res.status(200).json(data))
})


app.listen(port, () => console.log(`Express server listening on port ${port}`))