import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'
import { Button } from 'primereact/button';
import {renderRows} from '../Aircraft Loadout/builder.jsx'

function PreviewAmbulatory({ length, location }) {
    return (
      <div className={`Ambulatory ${location}`}>
        {[...Array(length)].map((_, index) => (
          <div key={index} className="AmbulatorySlot">
            {`${location}_${index}`}
          </div>
        ))}
      </div>
    );
}
  
// Simplified Litter Component for Preview
function PreviewLitter({ length, location }) {
    return (
      <div className={`Litter ${location}`}>
        {[...Array(length)].map((_, index) => (
          <div key={index} className="LitterSlot">
            {`${location}_${index}`}
          </div>
        ))}
      </div>
    );
}

export default function HomePage() {
    const [patients, setPatients] = useState([]);
    const [plane, setPlane] = useState([]);
    const [selectedAircraft, setSelectedAircraft] = useState('');
    const [planeData, setPlaneData] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetch('http://localhost:8080/patientsmission1')
        .then(res => res.json())
        .then(data => setPatients(data));
      fetch('http://localhost:8080/aircraft')
        .then(res => res.json())
        .then(data => setPlane(data));
    }, []);
  
    function handleAircraftChange(event) {
      const selectedAcName = event.target.value;
      setSelectedAircraft(selectedAcName);
      const selectedPlane = plane.find(ac => ac.ac_name === selectedAcName);
      setPlaneData(selectedPlane);
    }

    function showpatientpreview() {
        return (
                <div className="homepage">
                    <div className="preview-container">
                        <div className="preview-column">
                <p>Patient Name:</p>
                <ul>
                    {patients.map(patient => (
                        <li key={patient.first_name}>
                            {patient.first_name} {patient.last_name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="preview-column2">
                <p>Destination:</p>
                <ul>
                    {patients.map(patient => (
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
          <select
            className="aircraft-dropdown"
            value={selectedAircraft}
            onChange={handleAircraftChange}
          >
            <option value="" disabled>Select an Aircraft</option>
            {plane.map(aircraft => (
              <option key={aircraft.ac_name} value={aircraft.ac_name}>
                {aircraft.ac_name}
              </option>
            ))}
          </select>
          <Button onClick={() => navigate('/AircraftList') }>View Aircraft List</Button> 
          {planeData ? (<>
              <Button onClick={() => navigate('/lp', {state: {selectedPlane: planeData}}) }>Select this aircraft</Button> 
            <div className="airplane-preview">
              <div className="preview-ambulatory la">
                <PreviewAmbulatory length={planeData.ambulatory_left} location="LA" />
              </div>
               <div className="preview-litter ll">
                <PreviewLitter length={planeData.litter_left} location="LL" />
              </div>
              <div className="preview-litter rl">
                <PreviewLitter length={planeData.litter_right} location="RL" />
                </div>
              <div className="preview-ambulatory ra">
                <PreviewAmbulatory length={planeData.ambulatory_right} location="RA" />
                </div>
            </div>
          </>) : null}
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