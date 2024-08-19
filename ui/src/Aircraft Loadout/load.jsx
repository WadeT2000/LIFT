import React, { useState, useEffect, } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { renderRows, Ambulatory, Litter, AmbulatorySlot, LitterSlot, PersonList, DraggablePerson } from './builder.jsx'
import './patientTable.css';
import './load.css';


import StopsInOrder from './Stops';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useAutoAssign from './autoAssign';
import  DarkModeToggle from '../DarkMode/DarkModeToggle';

function Load() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const location = useLocation()
  const selectedPlane = location.state?.selectedPlane //this grabs what plane was chosen on the homepage
  const [plane, setPlane] = useState({}); //this grabs seat data from the fetch, depending on which plane was set in 'selectedPlane'
  const [occupiedSeats, setOccupiedSeats] = useState({});
  const [attendants, setAttendants] = useState([])
  const { autoAssignPatients, loading} = useAutoAssign();

  useEffect(() => {
    fetch('http://localhost:8080/patientsmission1')
      .then(response => response.json())
      .then(data => setPatients(data)) // Correctly stores patient data
      .catch(error => console.error('Error fetching patients:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/attendantsmission1')
      .then(response => response.json())
      .then(data => setAttendants(data)) // Correctly stores attendant data
      .catch(error => console.error('Error fetching attendants:', error));
  }, []);

  useEffect(() => {
    //turn selectedPlane data to relevant array location
    console.log(selectedPlane)
    let arrayspot = null
    if (selectedPlane) {arrayspot = 0} //
    else if (selectedPlane) {arrayspot = 1}
    fetch('http://localhost:8080/aircraft')
      .then(response => response.json())
      .then(data => setPlane(data[0]))
      .catch(error => console.error('Error fetching plane data:', error));
  }, []);

  const movePatient = (patientId, toSlot) => {
    setOccupiedSeats(prev => {
      const newOccupiedSeats = { ...prev };
      // Remove patient from previous slot
      Object.keys(newOccupiedSeats).forEach(slot => {
        if (newOccupiedSeats[slot] === patientId) {
          delete newOccupiedSeats[slot];
        }
      });
      // Add patient to new slot
      if (toSlot) {
        newOccupiedSeats[toSlot] = patientId;
      }
      return newOccupiedSeats;
    });
  };

  const moveAttendant = (attendantId, toSlot) => {
    setOccupiedSeats(prev => {
      const newOccupiedSeats = { ...prev };
      // Remove attendant from previous slot
      Object.keys(newOccupiedSeats).forEach(slot => {
        if (newOccupiedSeats[slot] === attendantId) {
          delete newOccupiedSeats[slot];
        }
      });
      // Add attendant to new slot
      if (toSlot) {
        newOccupiedSeats[toSlot] = attendantId;
      }
      return newOccupiedSeats;
    });
  };

  const handleClick = () => {
    navigate('/home');
  }

  const handleAutoAssign = () => {
    const assignments = autoAssignPatients();
    if (assignments) {
      setOccupiedSeats(assignments);
      console.log("Seats assigned:", assignments);
    }
  };

  return (
    <div className="load-container">
     <button className='Back-bttn' onClick={handleClick}>Home
</button>
      <div className="stops">
        <button className="auto-assign-btn" onClick={handleAutoAssign}>Auto Assign</button>
        <StopsInOrder />
      </div>
      <div className="main-content">
        <div className="airplane-section">
          {renderRows(plane, patients, attendants, occupiedSeats, movePatient, moveAttendant)}
        </div>
        <div className="person-list">
          <PersonList
            people={patients.filter(p => !Object.values(occupiedSeats).includes(p.patient_id))}
            movePatient={movePatient}
            isAttendantList={false} // Specifies this is the Patient List
          />
        </div>
        <div className="person-list">
            <PersonList
            people={attendants.filter(a => !Object.values(occupiedSeats).includes(a.id))}
            moveAttendant={moveAttendant} // Change this line
            isAttendantList={true} // Specifies this is the Attendant List
/>
        </div>
      </div>

      </div>
        <div className="darkmode-container">
              <DarkModeToggle />
        </div>
    </div>
  );
}


export default Load;
