import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PatientList() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    destination: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo({ ...patientInfo, [name]: value });
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    setPatients([...patients, patientInfo]);
    setPatientInfo({ firstName: '', lastName: '', destination: '' });
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Patient List</h2>
      <form onSubmit={handleAddPatient}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={patientInfo.firstName}
          onChange={handleInputChange}
          required
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={patientInfo.lastName}
          onChange={handleInputChange}
          required
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={patientInfo.destination}
          onChange={handleInputChange}
          required
          style={{ marginRight: '10px' }}
        />
        <button type="submit">Add Patient</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {patients.map((patient, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              {patient.firstName} {patient.lastName} - {patient.destination}
            </li>
          ))}
        </ul>
        <button onClick={() => navigate('/home')}>Back</button>
      </div>
    </div>
  );
}
