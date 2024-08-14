import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'
import { Button } from 'primereact/button';




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
                <div className="homepage">
                    <div className="preview-container">
                        <div className="preview-column">
                <p>Patient Name:</p>
                <ul>
                    {patientlist.map(patient => (
                        <li key={patient.first_name}>
                            {patient.first_name} {patient.last_name} {patient.attendants}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="preview-column">
                <p>Destination:</p>
                <ul>
                    {patientlist.map(patient => (
                        <li key={patient.last_name}>
                            {patient.dds}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
        );
    }

    function aircraftoptions() {
        return (
            <div>
                <select className="aircraft-dropdown">
                    {aircraftlist.map(aircraft => (
                        <option key={aircraft.ac_name} value={aircraft.ac_name}>{aircraft.ac_name}</option>
                    ))}
                </select>
            </div>
        );
    }

    return (
        <div className="homepage-container">
            <div className="homepage-content">
                <h2 className="homepage-title">Aeromedical Evacuation Load Plan</h2>
                <div className="patientbox">
                    <div className="patientselectbox">
                        <h2>Patient List</h2>
                        <p>Mission 1</p>
                        <Button onClick={() => navigate('/PatientList')}>Edit Patients</Button> 
                    </div>
                    <div className="patientpreview">
                        {showpatientpreview()}
                    </div>
                </div>
                <div className="aircraftbox">
                    <div className="aircraftselectbox">
                        <h2>Aircraft List</h2>
                        {aircraftoptions()}
                    </div>
                </div>
            </div>
        </div>
    );
}