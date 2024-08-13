// import React, { useState, useEffect } from 'react';
// import './patientTable.css';
// import { useDrag } from 'react-dnd'

// const PatientTable = () => {
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('http://localhost:8080/patientsmission1')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setPatients(data);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);

// }

// const PlaneData = () => {
//   const [plane, setPlane] = useState({})
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('http://localhost:8080/aircraft')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setPlane(data);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);
// }

// function DraggablePerson({ person }) {
//   const [{ isDragging }, drag] = useDrag({
//     type: 'PERSON',
//     item: { id: person.id },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   return (
//     <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
//       {person.name}
//     </div>
//   );
// }

// function Load({ SeatData, people }) {
//   return (
//     <>
//       <div className="Load">
//         {renderCars(SeatData)}
//       </div>
//       <PersonList people={people} />
//     </>
//   );
// }

// function renderCars(SeatData) {
//   return (
//     <>
//       <Ambulatory length={SeatData.Left_Ambulatory} location="Left Ambulatory" />
//       <Litter length={SeatData.Left_Litter} location="Left Litter" />
//       <Ambulatory length={SeatData.Right_Ambulatory} location="Right Ambulatory" />
//       <Litter length={SeatData.Right_Litter} location="Right Litter" />
//     </>
//   );
// }

// function Ambulatory({ length, location }) {
//   return (
//     <div className={`Ambulatory ${location}`}>
//       {[...Array(length)].map((_, index) => (
//         <div key={index} className="AmbulatorySlot">
//           {`Ambulatory ${index + 1}`}
//         </div>
//       ))}
//     </div>
//   );
// }

// function Litter({ length, location }) {
//   return (
//     <div className={`Litter ${location}`}>
//       {[...Array(length)].map((_, index) => (
//         <div key={index} className="LitterSlot">
//           {`Litter ${index + 1}`}
//         </div>
//       ))}
//     </div>
//   );
// }

// function PersonList({ people }) {
//   const handleDragStart = (event, patientName) => {
//     event.dataTransfer.setData('text/plain', patientName);
//   };

//   return (
//     <div className="patient-list-container">
//       <h2 className="patient-list-title">Patient List</h2>
//       <div className="table-container">
//         <table className="patient-table">
//           <thead>
//             <tr>
//               <th>Patient Name</th>
//               <th>Code</th>
//             </tr>
//           </thead>
//           <tbody>
//             {patients.map((patient) => (
//               <tr key={patient.id}>
//                 <td
//                   style={{ padding: '5px', borderBottom: '1px solid #ddd', cursor: 'move' }}
//                   draggable="true"
//                   onDragStart={(e) => handleDragStart(e, patient.name)}
//                 >
//                   {patient.name}
//                 </td>
//                 <td>{patient.dds}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export { Load, Ambulatory, Litter, PersonList };
