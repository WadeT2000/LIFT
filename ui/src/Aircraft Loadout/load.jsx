import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { renderRows, Ambulatory, Litter, AmbulatorySlot, LitterSlot, PersonList, DraggablePerson } from './builder.jsx'
import './patientTable.css';
import './load.css';
import StopsInOrder from './Stops';

function Load() {
  const [patients, setPatients] = useState([]);
  const [plane, setPlane] = useState({});
  const [occupiedSeats, setOccupiedSeats] = useState({});
  const [attendants, setAttendants] = useState([])

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



  return (
    <div className="load-container">
      <div className="stops">
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
            movePatient={moveAttendant}
            isAttendantList={true} // Specifies this is the Attendant List
          />
        </div>

      </div>
    </div>
  );
}


export default Load;
