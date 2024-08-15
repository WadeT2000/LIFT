import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';

function renderRows(planeData, patients, occupiedSeats, movePatient) {
  return (
    <div className="airplane-container">
      <div className="airplane-body">
        <div className="airplane-section left-section">
          <div className="ambulatory-seats">
            <Ambulatory length={planeData.ambulatory_left}
              location="LA"
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
                location="LL"
                patients={patients}
                occupiedSeats={occupiedSeats}
                movePatient={movePatient}
              />
            </div>
            <div className="litter-beds">
              <Litter length={planeData.litter_right}
                location="RL"
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
              location="RA"
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
          slotId={`${location} ${index}`}
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
          slotId={`${location} ${index}`}
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
      {occupant ? `${slotId} ${occupant.first_name} ${occupant.last_name}` : slotId}
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
        backgroundColor: isOver ? 'lightgreen' : 'white',
        opacity: isDragging ? 0.5 : 1
      }}
    >
      {occupant ? `${slotId} ${occupant.first_name} ${occupant.last_name}` : slotId}
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

export { renderRows, Ambulatory, Litter, AmbulatorySlot, LitterSlot, PersonList, DraggablePerson }