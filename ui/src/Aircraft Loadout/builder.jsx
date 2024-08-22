import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import DarkModeToggle from '../DarkMode/DarkModeToggle';
import './builder.css';

function renderRows(planeData, patients, attendants, occupiedSeats, movePatient, moveAttendant) {
  return (
    <div className="airplane-container">
      <div className="airplane-body">
        <div className="airplane-section left-section">
          <div className="ambulatory-seats">
            <Ambulatory length={planeData.ambulatory_left}
              location="LA"
              patients={patients}
              attendants={attendants}
              occupiedSeats={occupiedSeats}
              movePatient={movePatient}
              moveAttendant={moveAttendant}
            />
          </div>
        </div>
        <div className="airplane-section center-section">
          <div className="litter-beds-container">
            <div className="litter-beds">
              <Litter length={planeData.litter_left}
                location="LL"
                patients={patients}
                attendants={attendants}
                occupiedSeats={occupiedSeats}
                movePatient={movePatient}
                moveAttendant={moveAttendant}
              />
            </div>
            <div className="litter-beds">
              <Litter length={planeData.litter_right}
                location="RL"
                patients={patients}
                attendants={attendants}
                occupiedSeats={occupiedSeats}
                movePatient={movePatient}
                moveAttendant={moveAttendant}
              />
            </div>
          </div>
        </div>
        <div className="airplane-section right-section">
          <div className="ambulatory-seats">
            <Ambulatory length={planeData.ambulatory_right}
              location="RA"
              patients={patients}
              attendants={attendants}
              occupiedSeats={occupiedSeats}
              movePatient={movePatient}
              moveAttendant={moveAttendant}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Ambulatory({ length, location, patients, attendants, occupiedSeats, movePatient, moveAttendant }) {
  return (
    <div className={`Ambulatory ${location}`}>
      {[...Array(length)].map((_, index) => (
        <AmbulatorySlot
          key={index}
          slotId={`${location} ${index}`}
          patients={patients}
          attendants={attendants}
          occupiedSeats={occupiedSeats}
          movePatient={movePatient}
          moveAttendant={moveAttendant}
        />
      ))}
    </div>
  );
}

function Litter({ length, location, patients, attendants, occupiedSeats, movePatient, moveAttendant }) {
  return (
    <div className={`Litter ${location}`}>
      {[...Array(length)].map((_, index) => (
        <LitterSlot
          key={index}
          slotId={`${location} ${index}`}
          patients={patients}
          attendants={attendants}
          occupiedSeats={occupiedSeats}
          movePatient={movePatient}
          moveAttendant={moveAttendant}
        />
      ))}
    </div>
  );
}

function AmbulatorySlot({ slotId, patients, attendants, occupiedSeats, movePatient, moveAttendant }) {
  const occupantId = occupiedSeats[slotId];
  const occupant = patients.find(p => p.patient_id === occupantId) || attendants.find(a => a.id === occupantId);

  const [{ isDragging }, drag] = useDrag({
    type: 'PERSON',
    item: () => occupant ? { ...occupant, fromSlot: slotId } : null,
    canDrag: () => !!occupant,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && !dropResult) {
        if (patients.find(p => p.patient_id === item.patient_id)) {
          movePatient(item.patient_id, null);
        } else {
          moveAttendant(item.id, null);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'PERSON',
    drop: (item) => {
      if (patients.find(p => p.patient_id === item.patient_id)) {
        movePatient(item.patient_id, slotId);
      } else {
        moveAttendant(item.id, slotId);
      }
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

function LitterSlot({ slotId, patients, attendants, occupiedSeats, movePatient, moveAttendant }) {
  const occupantId = occupiedSeats[slotId];
  const occupant = patients.find(p => p.patient_id === occupantId) || attendants.find(a => a.id === occupantId);

  const [{ isDragging }, drag] = useDrag({
    type: 'PERSON',
    item: () => occupant ? { ...occupant, fromSlot: slotId } : null,
    canDrag: () => !!occupant,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && !dropResult) {
        if (patients.find(p => p.patient_id === item.patient_id)) {
          movePatient(item.patient_id, null);
        } else {
          moveAttendant(item.id, null);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'PERSON',
    drop: (item) => {
      if (patients.find(p => p.patient_id === item.patient_id)) {
        movePatient(item.patient_id, slotId);
      } else {
        moveAttendant(item.id, slotId);
      }
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

function PersonList({ people, movePatient, moveAttendant, isAttendantList }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'PERSON',
    drop: (item) => {

      if (isAttendantList) {
        moveAttendant(item.id, null);
      } else {
        movePatient(item.patient_id, null);
      }
      return { name: isAttendantList ? 'AttendantList' : 'PatientList' };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <>
      <div ref={drop} className="patient-list-container" >
        <h2 className="patient-list-title">{isAttendantList ? "Attendant List" : "Patient List"}</h2>
        <div className="table-container">
          <table className="patient-table">
            <thead>
              <tr>
                <th>{isAttendantList ? "Attendant" : "Patient"}</th>
                <th>{isAttendantList ? "Watching" : "DDS"}</th>
                <th>{isAttendantList ? null : "Requirements"}</th>
                <th>{isAttendantList ? null : "Attendants"}</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={isAttendantList ? person.id : person.patient_id}>
                  <td>
                    <DraggablePerson
                      person={person}
                      movePatient={movePatient}
                      moveAttendant={moveAttendant}
                      isAttendant={isAttendantList}
                    // movePatient={isAttendantList ? moveAttendant : movePatient}
                    // isAttendant={isAttendantList}

                    />
                  </td>
                  {/* <td>{isAttendantList ? person.watching : person.dds}</td> */}
                  <td>{isAttendantList ? `${person.patient_fn} ${person.patient_ln}` : person.dds}</td>
                  <td>{isAttendantList ? null : person.requirements}</td>
                  <td>{isAttendantList ? null : person.attendants == 0 ? null : person.attendants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
// Did a change here reminder
// function DraggablePerson({ person, movePatient,moveAttendant, isAttendant }) {
//   const [{ isDragging }, drag] = useDrag({
//     type: 'PERSON',
//     item: { ...person },
//     end: (item, monitor) => {
//       const dropResult = monitor.getDropResult();
//       if (item && dropResult) {
//         if(isAttendant) {
//           moveAttendant(item.id,dropResult.slotId);
//         } else {
//           movePatient(item.patient_id, dropResult.slotId);
//         }
//       //   movePatient(isAttendant ? item.id : item.patient_id, dropResult.slotId);
//       }
//     },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   return (
//     <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
//       {`${person.first_name} ${person.last_name}`}
//     </div>
//   );
// }

function DraggablePerson({ person, movePatient, moveAttendant, isAttendant }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'PERSON',
    item: { ...person },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        if (isAttendant) {
          moveAttendant(item.id, dropResult.slotId);
        } else {
          movePatient(item.patient_id, dropResult.slotId);
        }
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