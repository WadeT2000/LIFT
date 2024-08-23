import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioButton } from 'primereact/radiobutton';
import { ListBox } from 'primereact/listbox';
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
    const [loadPlans, setLoadPlans] = useState([]);
    const [selectedLoadPlan, setSelectedLoadPlan] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetch('http://localhost:8080/patientsmission1')
        .then(res => res.json())
        .then(data => setPatients(data));
      fetch('http://localhost:8080/aircraft')
        .then(res => res.json())
        .then(data => setPlane(data));
        fetch('http://localhost:8080/loadplans')
        .then(res => res.json())
        .then(data => setLoadPlans(data))
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
                      <div className="header-row">
                          <h1 className="header-name">Patient Name</h1>
                          <h1 className="header-destination">Destination</h1>
                      </div>
                      <div className="patient-destination-box">
                          {patients.map(patient => (
                              <div key={patient.first_name} className="patient-destination-row">
                                  <span className="patient-name">
                                      {patient.first_name} {patient.last_name}
                                  </span>
                                  <span className="patient-destination">
                                      {patient.dds}
                                  </span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      );
  }
  
  
    function aircraftoptions() {
      return (
      <div>
        <div>
          <ListBox
            value={selectedAircraft}
            options={plane.map(aircraft => ({
              label: (
                <div className="aircraft-item">
                  <span>{aircraft.ac_name}</span>
                  <RadioButton
                    value={aircraft.ac_name}
                    checked={selectedAircraft === aircraft.ac_name}
                    onChange={handleAircraftChange}
                    className='aircraft-button'
                  />
                </div>
              ),
              value: aircraft.ac_name,
              }))}
            onChange={handleAircraftChange}
            className="listbox"
          />
        </div>
        <div className="form-button">
          <Button 
            label='Select this aircraft' 
            icon="pi pi-pencil" 
            className="p-button-warning" 
            onClick={() => navigate('/lp', {state: {selectedPlane: planeData}})} 
            disabled={selectedAircraft  === ''}
          /> 
        </div>
          {planeData ? (<>
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
          </>) : null
          }
      </div>
    );
  }

    async function deleteLoadPlan(loadplanid) {
      try {
          const response = await fetch(`http://localhost:8080/loadplandelete/${loadplanid}`, {
              method: 'DELETE',
              credentials: 'include'
          });
          if (response.ok) {
              setLoadPlans(loadPlans.filter(loadplan => loadplan.id !== loadplanid));
              setSelectedLoadPlan(null);
          } else {
              console.error("Failed to delete Load Plan");
          }
      } catch (error) {
          console.error("Error deleting Load Plan:", error);
      }
  }
  
    return (
      <div className="homepage-container">
        <div className="homepage-content">
          <h2 className="homepage-title">Aeromedical Evacuation Load Plan</h2>
          <div className="patientbox">
            <div className="patientselectbox">
              <h2>Patient List</h2>
              <Button onClick={() => navigate('/PatientList')}>View Patients List</Button>
            </div>
            <div className="patientpreview">
              {showpatientpreview()}
            </div>
          </div>
          <div className="aircraftbox">
            <div className="aircraftselectbox">
              <h2>Aircraft List</h2>
              <Button onClick={() => navigate('/AircraftList') }>View Aircraft List</Button> 
              {aircraftoptions()}
            </div>
          </div>
          <div className='loadplanbox'>
          <div>
                    <h1 className="heading-list">LoadPlans</h1>
                    <ListBox
                        value={selectedLoadPlan}
                        options={loadPlans.map(loadPlan => ({
                            label: (
                                <div>
                                    {`${loadPlan.lp_name}`}
                                    <RadioButton
                                        value={loadPlan.id}
                                        checked={selectedLoadPlan === loadPlan.id}
                                    />
                                </div>
                            ),
                            value: loadPlan.id,
                        }))}
                        onChange={(e) => setSelectedLoadPlan(e.value)}
                        className="listbox"
                    />
                </div>

                <div className="form-button">
                    <Button
                        label="View Loadplan"
                        icon="pi pi-pencil"
                        className="p-button-warning"
                        onClick={() => navigate(`/LoadPlanView/${selectedLoadPlan}`)}
                        disabled={selectedLoadPlan === null}
                    />
                    <Button
                        label="Delete Load Plan"
                        icon="pi pi-trash"
                        className="p-button-danger"
                        onClick={() => deleteLoadPlan(selectedLoadPlan)}
                        disabled={selectedLoadPlan === null}
                    />
                </div>
          </div>
        </div>
      </div>
    );
}