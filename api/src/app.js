const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || "development"]);

const SECRET_KEY = "my_secret_key"; 

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());

app.post("/verify", async (req, res) => {
    const { fname, lname, user, pass, type } = req.body;
    let query = await knex('users').select("*").where("username", user);

    
    if (type === "login") {
        if (query.length === 1 && await bcrypt.compare(pass, query[0].password)) {
            const token = jwt.sign({ username: user }, SECRET_KEY, { expiresIn: '1d' });
            await knex('users').update({auth_token: token}).where("username", user);
            res.cookie('auth_token', token, { httpOnly: true, secure: false });
            res.status(200).json({ message: "Logging you in", token });
        } else {
            res.status(404).json({ message: "Incorrect username or password" });
        }
    } else if (type === "create") {
        if (query.length === 0) {
            const hashedPassword = await bcrypt.hash(pass, 10);
            await knex('users').insert({ first_name: fname, last_name: lname, username: user, password: hashedPassword, auth_token: ''});
            res.status(200).json({ message: "User created" });
        } else {
            res.status(401).json({ message: "User exists with that username already" });
        }
    } else {
        res.status(404).json({ message: "Invalid operation" });
    }
});

app.get('/', (req, res) => {
    res.status(200).send('My API is up and running! Endpoints are /users, /patients<mission#>, /attendants<mission#>, /aircrafts')
})

app.get('/users', (req, res) => {
    knex('users').select('*').then(data => res.status(200).json(data))
})

app.get('/patientsmission1', (req, res) => {
    knex('patient_mission_1').select('*').then(data => res.status(200).json(data))
})

app.get('/attendantsmission1', (req, res) => {
    knex('attendant_mission_1').select('*').then(data => res.status(200).json(data))
})

app.get('/aircraft', (req, res) => {
    knex('aircraft').select('*').then(data => res.status(200).json(data))
})



app.listen(port, () => console.log(`Express server listening on port ${port}`))