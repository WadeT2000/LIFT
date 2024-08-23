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
    res.status(200).send('My API is up and running! Endpoints are /users, /patientsmission1, /attendantsmission1, /aircrafts, /loadplans')
})

app.get('/users', (req, res) => {
    knex('users').select('*').then(data => res.status(200).json(data))
})

app.get('/patientsmission1', (req, res) => {
    const { search } = req.query;
    let query = knex('patient_mission_1').select('*');
    if (search) {
        query = query.where('id', search);
    }
    query
        .then(data => res.status(200).json(data))
        .catch(error => res.status(500).json({ error: error.message }));
});

app.get('/attendantsmission1', (req, res) => {
    knex('attendant_mission_1').select('*')
        .then(data => res.status(200).json(data))
})

app.get('/mission1', (req, res) => {
    knex('attendant_mission_1')
        .join('patient_mission_1', 'patient_mission_1.id', 'attendant_mission_1.patient_id')
        .then(data => res.status(200).json(data))
})

app.get('/loadattendants', async (req, res) => {
    try {
        const data = await knex('attendant_mission_1 as am1')
            .join('patient_mission_1 as pm1', 'pm1.id', 'am1.patient_id')
            .select(
                "am1.id",
                "am1.patient_id",
                "pm1.first_name as patient_fn",
                "pm1.last_name as patient_ln",
                "am1.first_name",
                "am1.last_name",
                // "am1.enplane",
                "am1.deplane",
                // "am1.age",
                // "am1.gender",
                // "am1.passenger_weight",
                // "am1.grade",
                // "am1.created_on",
                // "am1.attendant_specialty",
            );

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

app.get('/aircraft', (req, res) => {
    const { search } = req.query
    let query = knex('aircraft').select('*')
    if(search) {
        query = query.where('ac_name', search);
    }
    query
        .then(data => res.status(200).json(data))
        .catch(error => res.status(500).json({ error: error.message }));
})

app.get('/aircraftid', (req, res) => {
    const { search } = req.query
    let query = knex('aircraft').select('*')
    if(search) {
        query = query.where('id', search);
    }
    query
        .then(data => res.status(200).json(data))
        .catch(error => res.status(500).json({ error: error.message }));
})

app.post('/addpatient', async (req, res) => {
    const { patientInfo, attendantInfo } = req.body;
    console.log("testing:", attendantInfo)
    let patientExists = await knex('patient_mission_1')
        .select('*')
        .where("first_name", patientInfo.firstName)
        .andWhere("last_name", patientInfo.lastName)
        .andWhere('patient_id', patientInfo.patientId);

    if (patientExists.length === 0) {
        let patientId = await knex('patient_mission_1')
            .insert({
                first_name: patientInfo.firstName,
                last_name: patientInfo.lastName,
                patient_id: patientInfo.patientId,
                casualty_event: patientInfo.casualtyEvent,
                requirements: patientInfo.requirements,
                attendants: patientInfo.attendants,
                originating_mtf: patientInfo.originatingMtf,
                destination_mtf: patientInfo.destinationMtf,
                primary_med_spec: patientInfo.primaryMedSpec,
                primary_diagnosis: patientInfo.primaryDiagnosis,
                secondary_diagnosis: patientInfo.secondaryDiagnosis,
                other_diagnosis: patientInfo.otherDiagnosis,
                eps: patientInfo.eps,
                dds: patientInfo.dds,
                upr: patientInfo.upr,
                age: patientInfo.age,
                gender: patientInfo.gender,
                passenger_weight: patientInfo.passengerWeight,
                grade: patientInfo.grade,
                equipment: patientInfo.equipment,
                diet: patientInfo.diet,
                max_alt: patientInfo.maxAlt,
                spec: patientInfo.spec,
                special_team: patientInfo.specialTeam
            })
            .returning('id');

        if (attendantInfo.length > 0) {
            for (let attendant of attendantInfo) {
                if(attendant.passenger_weight === null) {
                    continue;
                }
                let atquery = await knex('attendant_mission_1')
                    .select('*')
                    .where('first_name', attendant.first_name)
                    .andWhere("last_name", attendant.last_name)
                    .andWhere('age', attendant.age)
                    .andWhere("gender", attendant.gender);

                if (atquery.length === 0) {
                    await knex('attendant_mission_1').insert({
                        patient_id: patientId[0].id,
                        first_name: attendant.first_name,
                        last_name: attendant.last_name,
                        enplane: attendant.enplane,
                        deplane: attendant.deplane,
                        age: attendant.age,
                        gender: attendant.gender,
                        passenger_weight: attendant.passenger_weight,
                        grade: attendant.grade,
                        created_on: "Lo-Side",
                        attendant_specialty: attendant.attendant_specialty
                    });
                }
            }
        }
        res.status(200).json({ message: "Patient and Attendants Added to the list" });
    } else {
        res.status(401).json({ message: "Patient already exists" });
    }
});

app.put('/patientmission1/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, patient_id, casualty_event, requirements, attendants, originating_mtf, destination_mtf, primary_diagnosis, secondary_diagnosis, other_diagnosis, eps, dds, upr, age, gender, passenger_weight, grade, equipment, diet, max_alt, spec, special_team} = req.body;

    try {
        await knex('patient_mission_1')
            .where('id', id)
            .update({first_name, last_name, patient_id, casualty_event, requirements, attendants, originating_mtf, destination_mtf, primary_diagnosis, secondary_diagnosis, other_diagnosis, eps, dds, upr, age, grade, passenger_weight, gender, equipment, diet, max_alt, spec, special_team});

        res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ message: 'Failed to update item' });
    }
});

app.put('/attendant1', async (req, res) => {
    const attendantAdjustInfo = req.body;
    try {
        for (let attendant of attendantAdjustInfo) {
            const { id, first_name, last_name, enplane, deplane, age, gender, passenger_weight, grade, attendant_specialty } = attendant;
            let existingAttendant = await knex('attendant_mission_1')
                .select('*')
                .where('id', id);
            if (existingAttendant.length > 0) {
                await knex('attendant_mission_1')
                    .where('id', id)
                    .update({
                        first_name,
                        last_name,
                        enplane,
                        deplane,
                        age,
                        gender,
                        passenger_weight,
                        grade,
                        attendant_specialty
                    });
            }
        }
        res.status(200).json({ message: 'Attendants updated successfully' });
    } catch (error) {
        console.error('Error updating attendants:', error);
        res.status(500).json({ message: 'Failed to update attendants' });
    }
});

app.post('/attendant1/:id', async (req, res) => {
    const { id } = req.params;
    const { attendantInfo } = req.body;
    console.log(attendantInfo)
    if (attendantInfo.length > 0) {
        for (let attendant of attendantInfo) {
            
            if(attendant.passenger_weight === null) {
                continue;
            }
            let atquery = await knex('attendant_mission_1')
                .select('*')
                .where('first_name', attendant.first_name)
                .andWhere("last_name", attendant.last_name)
                .andWhere('age', attendant.age)
                .andWhere("gender", attendant.gender);

            if (atquery.length === 0) {
                await knex('attendant_mission_1').insert({
                    patient_id: id,
                    first_name: attendant.first_name,
                    last_name: attendant.last_name,
                    enplane: attendant.enplane,
                    deplane: attendant.deplane,
                    age: attendant.age,
                    gender: attendant.gender,
                    passenger_weight: attendant.passenger_weight,
                    grade: attendant.grade,
                    created_on: "Lo-Side",
                    attendant_specialty: attendant.attendant_specialty
                });
            }
        }
    res.status(200).json({ message: "Attendant(s) Added to the list" });
    } else {
    res.status(401).json({ message: "Patient already exists" });
    }
})

app.delete('/attendant1/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await knex('attendant_mission_1')
            .where({ id })
            .del();

        res.status(200).json({ message: 'Attendant deleted successfully' });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: 'Failed to delete item' });
    }
})

app.delete('/patientmission1/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await knex('patient_mission_1')
            .where({ id })
            .del();

        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: 'Failed to delete item' });
    }
});

app.get('/attendantmission1/:id', async (req, res) => {
    const { id } = req.params;
        await knex('attendant_mission_1')
            .where('patient_id', id)
            .then(data => res.status(200).json(data))
});

app.delete('/attendantmission1/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await knex('attendant_mission_1')
            .where('patient_id', id)
            .del();

        res.status(200).json({ message: 'Attendant deleted successfully' });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: 'Failed to delete item' });
    }
});

app.delete('/attendant/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const attendant = await knex('attendant_mission_1')
            .where({ id })
            .first();
        if (!attendant) {
            return res.status(404).json({ message: 'Attendant not found' });
        }
        const patientId = attendant.patient_id;
        await knex('attendant_mission_1')
            .where({ id })
            .del();
        await knex('patient_mission_1')
            .where('id', patientId)
            .decrement('attendants', 1);
        res.status(200).json({ message: 'Attendant deleted successfully and patient updated' });
    } catch (error) {
        console.error("Error deleting attendant and updating patient:", error);
        res.status(500).json({ message: 'Failed to delete attendant and update patient' });
    }
});

app.get('/attendantm1/:id', async (req, res) => {
    const { id } = req.params
    try {
        await knex('attendant_mission_1')
        .where({ id })
        .then(data => res.status(200).json(data))
    } catch (error) {
        console.error("Error Fetching Attendant:", error);
        res.status(500).json({ message: 'Failed to find attendant' });
    }
})

app.put('/attendantsingle', async (req, res) => {
    const { id, first_name, last_name, enplane, deplane, age, gender, passenger_weight, grade, attendant_specialty } = req.body;
    try {
        await knex('attendant_mission_1')
            .where('id', id)
            .update({
                first_name,
                last_name,
                enplane,
                deplane,
                age,
                gender,
                passenger_weight,
                grade,
                attendant_specialty
            });

        res.status(200).json({ message: 'Attendant updated successfully' });
    } catch (error) {
        console.error('Error updating attendant:', error);
        res.status(500).json({ message: 'Failed to update attendant' });
    }
});


app.delete('/aircraftdelete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await knex('aircraft')
            .where({ id })
            .del();

        res.status(200).json({ message: 'Attendant deleted successfully' });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: 'Failed to delete item' });
    }
})

app.put('/aircraftedit/:id', async (req, res) => {
    const { id, ac_name, ambulatory_left, ambulatory_right, litter_left, litter_right } = req.body;
    try {
        await knex('aircraft')
            .where('id', id)
            .update({
                ac_name,
                ambulatory_left,
                ambulatory_right,
                litter_left,
                litter_right
            });

        res.status(200).json({ message: 'Aircraft updated successfully' });
    } catch (error) {
        console.error('Error updating Aircraft:', error);
        res.status(500).json({ message: 'Failed to update Aircraft' });
    }
})

app.post('/aircraftcreate', async (req, res) => {
        const { ac_name, ambulatory_left, ambulatory_right, litter_left, litter_right } = req.body;
        let aircraftExists = await knex('aircraft').select('*').where("ac_name", ac_name)    
        if (aircraftExists.length === 0) {
            await knex('aircraft')
                .insert({
                    ac_name,
                    ambulatory_left,
                    ambulatory_right,
                    litter_left,
                    litter_right
                })
                res.status(200).json({ message: "Aircraft Added to the list" });
            } else {
                res.status(401).json({ message: "Aircraft already exists" });
            }
})

app.get('/loadplans', (req, res) => {
    const { search } = req.query
    let query = knex('load_plan').select('*')
    if (search) {
        query = query.where('id', search);
    }
    query
        .then(data => res.status(200).json(data))
        .catch(error => res.status(500).json({ error: error.message }));
})


app.post('/lpsave', async (req, res) => {
    const { loadPlanInfo, occupiedSeats, sortedStops, plane } = req.body;
    let saveExists = await knex('load_plan').select("*").where('lp_name', loadPlanInfo.lp_name);
    if(saveExists.length === 0) {
        const occupiedSeatsJson = JSON.stringify(occupiedSeats);
        const stopsOrderJson = JSON.stringify(sortedStops);
        const planeJson = JSON.stringify(plane);
        await knex('load_plan').insert({
            lp_name: loadPlanInfo.lp_name,
            occupied_seats: occupiedSeatsJson,
            stops_order: stopsOrderJson,
            plane: planeJson
        })
        res.status(200).json({ message: "Load Plan has been saved" });
    } else {
        res.status(401).json({ message: "Load Plan already exists" });
    }
})

app.delete('/loadplandelete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await knex('load_plan')
            .where({ id })
            .del();

        res.status(200).json({ message: 'Load Plan deleted successfully' });
    } catch (error) {
        console.error("Error deleting Load Plan:", error);
        res.status(500).json({ message: 'Failed to delete Load Plan' });
    }
})

app.put('/lpupdate/:id', async (req, res) => {
    const { id } = req.params
    const { loadPlanInfo, occupiedSeats, sortedStops, plane } = req.body;
    try {
        const occupiedSeatsJson = JSON.stringify(occupiedSeats);
        const stopsOrderJson = JSON.stringify(sortedStops);
        const planeJson = JSON.stringify(plane);
        await knex('load_plan')
            .where('id', id)
            .update({
            lp_name: loadPlanInfo.lp_name,
            occupied_seats: occupiedSeatsJson,
            stops_order: stopsOrderJson,
            plane: planeJson
        });
        res.status(200).json({ message: 'Load PLan updated successfully' });
    } catch (error) {
        console.error('Error updating Load Plan:', error);
        res.status(500).json({ message: 'Failed to update Load Plan' });
    }
})

app.post('/updatepatients', (req, res) => {
    console.log(req.body)
})

app.listen(port, () => console.log(`Express server listening on port ${port}`))