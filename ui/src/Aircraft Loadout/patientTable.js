import React, { useState, useEffect } from 'react';
import './patientTable.css';

const PatientTable = () => {
  const [patients, setPatients] = useState([]);
  // const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/patientsmission1')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  // Mock API for testing

  // const fetchPatientData = () => {
  //     return new Promise((resolve) => {
  //         setTimeout(() => {
  //             resolve([
  //                 { id: 1, name: "John Brown", dds: 'KNFS'},
  //                 { id: 2, name: "Johnny Brown", dds: 'KNFS' },
  //                 { id: 3, name: "Joe Brown", dds: 'KNFS' },
  //             ]);
  //         }, 1000);
  //     });
  // };

  // useEffect(() => {
  //     setLoading(true);
  //     fetchPatientData()
  //         .then(data => {
  //             setPatients(data);
  //             setLoading(false);
  //         })
  //         .catch(err => {
  //             console.error('Error fetching data:', err);
  //             setLoading(false);
  //         });
  // }, []);

  const handleDragStart = (event, patientName) => {
    event.dataTransfer.setData('text/plain', patientName);
  };

  return (
    <div className="patient-list-container">
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
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td
                  style={{ padding: '5px', borderBottom: '1px solid #ddd', cursor: 'move' }}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, patient.name)}
                >
                  {patient.name}
                </td>
                <td>{patient.dds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default PatientTable;