import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
// import './builder.jsx'
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

function renderRows(planeData, patients, occupiedSeats, movePatient) {
  return (
    <div className="airplane-container">
      <div className="airplane-body">
        <div className="airplane-section left-section">
          <div className="ambulatory-seats">
            <Ambulatory length={planeData.ambulatory_left}
              location="Left Ambulatory"
              patients={patients}
              occupiedSeats={occupiedSeats}
              movePatient={movePatient}
            />
          </div>
        </div>
        <div className="airplane-section center-section">
          <div className="litter-beds-container">
            <div className="litter-beds">
              <Litter length={planeData.litter_left}
                location="Left Litter"
                patients={patients}
                occupiedSeats={occupiedSeats}
                movePatient={movePatient}
              />
            </div>
            <div className="litter-beds">
              <Litter length={planeData.litter_right}
                location="Right Litter"
                patients={patients}
                occupiedSeats={occupiedSeats}
                movePatient={movePatient}
              />
            </div>
          </div>
        </div>
        <div className="airplane-section right-section">
          <div className="ambulatory-seats">
            <Ambulatory length={planeData.ambulatory_right}
              location="Right Ambulatory"
              patients={patients}
              occupiedSeats={occupiedSeats}
              movePatient={movePatient}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Ambulatory({ length, location, patients, occupiedSeats, movePatient }) {
  return (
    <div className={`Ambulatory ${location}`}>
      {[...Array(length)].map((_, index) => (
        <AmbulatorySlot
          key={index}
          slotId={`${location}_${index}`}
          patients={patients}
          occupiedSeats={occupiedSeats}
          movePatient={movePatient}
        />
      ))}
    </div>
  );
}

function Litter({ length, location, patients, occupiedSeats, movePatient }) {
  return (
    <div className={`Litter ${location}`}>
      {[...Array(length)].map((_, index) => (
        <LitterSlot
          key={index}
          slotId={`${location}_${index}`}
          patients={patients}
          occupiedSeats={occupiedSeats}
          movePatient={movePatient}
        />
      ))}
    </div>
  );
}

function AmbulatorySlot({ slotId, patients, occupiedSeats, movePatient }) {
  const occupantId = occupiedSeats[slotId];
  const occupant = patients.find(p => p.patient_id === occupantId);

  const [{ isDragging }, drag] = useDrag({
    type: 'PERSON',
    item: () => occupant ? { ...occupant, fromSlot: slotId } : null,
    canDrag: () => !!occupant,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && !dropResult) {
        movePatient(item.patient_id, null);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'PERSON',
    drop: (item) => {
      movePatient(item.patient_id, slotId);
      return { slotId };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={node => drag(drop(node))}
      className="AmbulatorySlot"
      style={{
        backgroundColor: isOver ? 'lightgreen' : 'white',
        opacity: isDragging ? 0.5 : 1
      }}
    >
      {occupant ? `${occupant.first_name} ${occupant.last_name}` : slotId}
    </div>
  );
}

function LitterSlot({ slotId, patients, occupiedSeats, movePatient }) {
  const occupantId = occupiedSeats[slotId];
  const occupant = patients.find(p => p.patient_id === occupantId);

  const [{ isDragging }, drag] = useDrag({
    type: 'PERSON',
    item: () => occupant ? { ...occupant, fromSlot: slotId } : null,
    canDrag: () => !!occupant,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && !dropResult) {
        movePatient(item.patient_id, null);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'PERSON',
    drop: (item) => {
      movePatient(item.patient_id, slotId);
      return { slotId };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={node => drag(drop(node))}
      className="LitterSlot"
      style={{
        backgroundColor: isOver ? 'lightblue' : 'white',
        opacity: isDragging ? 0.5 : 1
      }}
    >
      {occupant ? `${occupant.first_name} ${occupant.last_name}` : slotId}
    </div>
  );
}

function PersonList({ people, movePatient }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'PERSON',
    drop: (item) => {
      movePatient(item.patient_id, null);
      return { name: 'PatientList' };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className="patient-list-container" style={{ backgroundColor: isOver ? 'lightyellow' : 'white' }}>
      <h2 className="patient-list-title">Patient List</h2>
      <div className="table-container">
        <table className="patient-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>
            {people.map((patient) => (
              <tr key={patient.patient_id}>
                <td>
                  <DraggablePerson person={patient} movePatient={movePatient} />
                </td>
                <td>{patient.dds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DraggablePerson({ person, movePatient }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'PERSON',
    item: { ...person },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        movePatient(item.patient_id, dropResult.slotId);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {`${person.first_name} ${person.last_name}`}
    </div>
  );
}

export default Load;
//export { Ambulatory, Litter, PersonList };