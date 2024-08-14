import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './builder.jsx'
import './patientTable.css';
import './load.css';

function Load() {
  const [patients, setPatients] = useState([]);
  const [plane, setPlane] = useState({});
  const [occupiedSeats, setOccupiedSeats] = useState({});

  useEffect(() => {
    fetch('http://localhost:8080/patientsmission1')
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.error('Error fetching patients:', error));
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

  return (
    <>
      <div className="Load">
        {renderRows(plane, patients, occupiedSeats, movePatient)}
      </div>
      <PersonList
        people={patients.filter(p => !Object.values(occupiedSeats).includes(p.patient_id))}
        movePatient={movePatient}
      />
    </>
  );
}



export default Load;
export { Ambulatory, Litter, PersonList };