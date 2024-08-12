import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'



export default function HomePage() {
    const [patientlist, setpatientlist] = useState([])
    const [attentdantslist, setattendantslist] = useState([])
    const [aircraftlist, setaircraftlist] = useState([])
    const navigate = useNavigate();

    useEffect(()=>{
        fetch('http://localhost:8080/patientsmission1').then(res => res.json()).then(data => setpatientlist(data));
        fetch('http://localhost:8080/attendantsmission1').then(res => res.json()).then(data => setattendantslist(data))
        fetch('http://localhost:8080/aircraft').then(res => res.json()).then(data => setaircraftlist(data))
    }, [])


    function showpatientpreview() {

        return (
            <div>
                <p>Patient Name:</p>
                <ul>
        {patientlist.map(patient => (
            <li key={patient.first_name}>
                {patient.first_name} {patient.last_name} {patient.attendants}
            </li>
        ))}
        </ul>
        <p>Destination:</p>
        <ul>
        {patientlist.map(patient => (
            <li key={patient.last_name}>
                {patient.dds}
            </li>
        ))}
        </ul>
            </div>
        )  
    }

    function aircraftoptions() {


        return (
            <div>
                <select>
                {aircraftlist.map(aircraft => (
                    <option value={aircraft.ac_name}>{aircraft.ac_name}</option>
                ))}
                </select>
            </div>
        )
    }

    function showaircraftpreview() {

    }



    return (
        <>
        <div style={{
            textAlign: 'center',
            padding: '50px',
            backgroundImage: 'url("https://media.defense.gov/2021/Sep/29/2002864215/2000/2000/0/170327-F-RU983-9032.JPG")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            zIndex: -1,
        }}>
            <h2 style={{
                fontSize: '30px'
            }}>Aeromedical Evacuation Load Plan</h2>
            <div className='patientbox'>
                <div className='patientselectbox'>
                    <h2>Patient List</h2>
                    <p>Mission 1</p>
                    <button onClick={() => navigate('/PatientList')}>Edit Patients</button>
                </div>
                <div className='patientpreview'>
                    {showpatientpreview()}
                </div>
            </div>
            <div className='aircraftbox'>
                <div className='aircraftselectbox'>
                    <h2>Aircraft List</h2>
                    {aircraftoptions()}
                    {/* <button onClick={() => navigate('/PatientList')}>Add Aircraft</button> */}
                </div>
                <div className='aircraftpreview'>
                    {/* {showaircraftpreview()} */}
                </div>
            </div>
        </div>
        
        </>
    )
}