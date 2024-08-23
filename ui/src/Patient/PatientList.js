import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import DarkModeToggle from '../DarkMode/DarkModeToggle';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './PatientList.css';

export default function PatientList() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [attendantPresent, setAttendantPresent] = useState([]);
    const [attendants, setAttendants] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedAttendant, setSelectedAttendant] = useState(null);
    const toast = useRef(null);

    async function deleteAttendant(attendantId) {
        try {
            const response = await fetch(`http://localhost:8080/attendant/${attendantId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                setAttendants(attendants.filter(attendant => attendant.id !== attendantId));
                setSelectedAttendant(null);
            } else {
                console.error("Failed to delete attendant");
            }
        } catch (error) {
            console.error("Error deleting attendant:", error);
        }
    }
 
    
    async function deletepatient(selectedPatient) {
        try {
            await fetch(`http://localhost:8080/attendantmission1/${selectedPatient}`)
                .then(res => res.json())
                .then(data => setAttendantPresent(data));

            if (attendantPresent.length > 0) {
                const aresponse = await fetch(`http://localhost:8080/attendantmission1/${selectedPatient}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (!aresponse.ok) {
                    console.error("Failed to delete attendant");
                }
            }

            const presponse = await fetch(`http://localhost:8080/patientmission1/${selectedPatient}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (presponse.ok) {
                setPatients(patients.filter(patient => patient.id !== selectedPatient));
                setAttendants(attendants.filter(attendant => attendant.patient_id !== selectedPatient));
                setSelectedPatient(null);
            } else {
                console.error("Failed to delete item");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }

    useEffect(() => {
        fetch('http://localhost:8080/patientsmission1').then(res => res.json()).then(data => setPatients(data));
        fetch('http://localhost:8080/loadattendants').then(res => res.json()).then(data => setAttendants(data));
    }, []);

    // File Upload functionality
    const onFileSelect = async (event) => {
        const file = event.files[0]; // Get the selected file

        const formData = new FormData();
        formData.append('file', file); // Append the file to the form data

        try {
            const response = await fetch('http://localhost:8080/updatepatients', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Upload Failed' });
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Upload Failed' });
            console.error('Error uploading file:', error);
        }
    };

    // File download functionality
    const generateCSVContent = () => {
        const headers = `first_name\t last_name\t patient_id\t casualty_event\t requirements\t attendants\t originating_mtf\t destination_mtf\t primary_med_spec\t primary_diagnosis\t secondary_diagnosis\t other_diagnosis\t eps\t dds\t upr\t age\t gender\t passenger_weight\t grade\t equipment\t diet\t max_alt\t spec\t special_team \n`
        // const headersA = ['first_name', 'last_name', 'patient_id', 'casualty_event', 'requirements', 'attendants', 'originating_mtf', 'destination_mtf', 'primary_med_spec', 'primary_diagnosis', 'secondary_diagnosis', 'other_diagnosis', 'eps', 'dds', 'upr', 'age', 'gender', 'passenger_weight', 'grade', 'equipment', 'diet', 'max_alt', 'spec', 'special_team']
        // console.log(patients[0])
        // const rowsS= (headersA) => {
        //     patients.map(patient => {
        //         console.log(headersA)
        //         let row = []
        //         for (let k of headersA){
        //             row.push(patient.headersA[k])
        //         }
        //         //row.toString()
        //     })
        // }
        // console.log(rowsS(headersA))
        const rows = patients.map(patient => 
            `${patient.first_name}\t${patient.last_name}\t${patient.patient_id}\t${patient.casualty_event}\t${patient.requirements}\t${patient.attendants}\t${patient.originating_mtf}\t${patient.destination_mtf}\t${patient.primary_med_spec}\t${patient.primary_diagnosis}\t${patient.secondary_diagnosis}\t${patient.other_diagnosis}\t${patient.eps}\t${patient.dds}\t${patient.upr}\t${patient.age}\t${patient.gender}\t${patient.passenger_weight}\t${patient.grade}\t${patient.equipment}\t${patient.diet}\t${patient.max_alt}\t${patient.spec}\t${patient.special_team}` || ''
        ).join('\n');
        return headers + rows;
    };

    const downloadCSV = () => {
        const csvContent = generateCSVContent();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'patient_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container">
          <div className="card">
            <div className="darkmode-container">
              <DarkModeToggle />
            </div>
            <Toast ref={toast} />
            <div className="form-button">
              <FileUpload
                mode="basic"
                name="file"
                accept=".csv"
                maxFileSize={1000000}
                onSelect={onFileSelect} 
                auto
                chooseLabel="Import Mission"
              />
              <Button label="Export Mission" onClick={downloadCSV} />
            </div>
      
            <div className="form-button">
            <Button
                label="Home"
                onClick={() => navigate('/home')}
                className="p-button-success"
              />
              <Button
                label="Add Single Patient"
                icon="pi pi-plus"
                onClick={() => navigate('/PatientAddPage')}
                className="p-button-success"
              />
            </div>
      
            <div>
              <h1 className="heading-list">Patients</h1>
              <ListBox
  value={selectedPatient}
  options={patients.map(patient => ({
    label: (
      <div className="p-listbox-item">
        <div className="p-listbox-item-content">
          {`${patient.first_name} ${patient.last_name} - ${patient.patient_id}`}
        </div>
        <RadioButton
          value={patient.id}
          checked={selectedPatient === patient.id}
        />
      </div>
    ),
    value: patient.id,
  }))}
  onChange={(e) => setSelectedPatient(e.value)}
  className="listbox"
/>

            </div>
      
            <div className="form-button">
              <Button
                label="Edit Patient"
                icon="pi pi-pencil"
                className="p-button-warning"
                onClick={() => navigate(`/PatientEdit/${selectedPatient}`)}
                disabled={selectedPatient === null}
              />
              <Button
                label="Delete Patient"
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => deletepatient(selectedPatient)}
                disabled={selectedPatient === null}
              />
            </div>
      
            <div>
              <h1 className="heading-list">Attendants</h1>
              <ListBox
  value={selectedAttendant}
  options={attendants.map(attendant => ({
    label: (
      <div className="p-listbox-item">
        <div className="p-listbox-item-content">
          {`${attendant.first_name} ${attendant.last_name} - ${attendant.patient_fn} ${attendant.patient_ln}`}
        </div>
        <RadioButton
          value={attendant.id}
          checked={selectedAttendant === attendant.id}
        />
      </div>
    ),
    value: attendant.id,
  }))}
  onChange={(e) => setSelectedAttendant(e.value)}
  className="listbox"
 />

            </div>
      
            <div className="form-button">
              <Button
                label="Edit Attendant"
                icon="pi pi-pencil"
                className="p-button-warning"
                onClick={() => navigate(`/AttendantEdit/${selectedAttendant}`)}
                disabled={selectedAttendant === null}
              />
              <Button
                label="Delete Attendant"
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => deleteAttendant(selectedAttendant)}
                disabled={selectedAttendant === null}
              />
            </div>
          </div>
        </div>
      );
    } 
