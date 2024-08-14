import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import {InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { ListBox } from 'primereact/listbox';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import addPatient from './AddPatient';


export default function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [attendantPresent, setAttendantPresent] = useState([]);
  const [attendants, setAttendants] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    patientId: '',
    casualtyEvent: '',
    requirements: '',
    attendants: '',
    originatingMtf: '',
    destinationMtf: '',
    primaryMedSpec: '',
    primaryDiagnosis: '',
    secondaryDiagnosis: '',
    otherDiagnosis: '',
    eps: '',
    dds: '',
    upr: '', 
    age: '',
    gender: '',
    passengerWeight: '',
    grade: '', 
    equipment: '',
    diet: '',
    maxAlt: '',
    spec: '',  
    specialTeam: '', 
  });
const [selectedPatient, setSelectedPatient] = useState(null);
const reqs = [{ name: '1A'}, { name: '1L'}]
const upr = [{name: 'Routine'}, {name: 'Urgent'}, {name: 'Urgant Surgical'}, {name: 'Expectant'}]
const spec = [{name:'Y'}, {name:'N'}]
const gender = [{name: 'Male'}, {name: 'Female'}, {name: 'Non-Binary'}, {name: 'Trans-Male'}, {name: 'Trans-Female'}]
const grade = [{name: `E01`}, {name: `E02`}, {name: `E03`}, {name: `E04`}, {name: `E05`}, {name: `E06`}, {name: `E07`}, {name: `E08`}, {name: `O01`}, {name: `O02`}, {name: `O03`}, {name: `O04`}, {name: `O05`}, {name: `O06`}]


  const AddPatient = async (e) => {
    e.preventDefault();
    const status = await addPatient(patientInfo);
    alert(status.message)
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
    fetch('http://localhost:8080/attendantsmission1').then(res => res.json()).then(data => setAttendants(data));
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo({ ...patientInfo, [name]: value });
  };

  const handleDropInputChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo({ ...patientInfo, [name]: value.name });
  };



//=================== File Upload Code==============================
  const toast = useRef(null);

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };
//=================== File Upload Code==============================

return (
  <div className="container" style={{ padding: '20px', textAlign: 'center' }}>
    <div className="card flex justify-content-center">
      <Toast ref={toast}></Toast>
      <FileUpload 
        mode="basic" 
        name="demo[]" 
        url="/api/upload" 
        accept="image/*" 
        maxFileSize={1000000} 
        onUpload={onUpload} 
        auto 
        chooseLabel="Add New Mission" 
      />
    </div>  

    <Card title="Patient List" style={{ width: '100%', maxWidth: '600px', marginTop: '20px' }}>
      <form onSubmit={AddPatient}>

      <div>
        <label>First Name</label>
        <InputText name="firstName" placeholder="First Name" value={patientInfo.firstName || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>Last Name</label>
        <InputText name="lastName" placeholder="Last Name" value={patientInfo.lastName} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>Patient ID</label>
        <InputNumber name='patientId' placeholder='Patient Id' value={patientInfo.patientId} onValueChange={handleInputChange} required style={{ marginRight: '10px' }} useGrouping={false}/>
      </div>

      <div>
        <label>Casualty Event</label>
        <InputText name="casualtyEvent" placeholder="Casualty Event" value={patientInfo.casualtyEvent} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>Requirements</label> 
        <Dropdown name='requirements' value={patientInfo.requirements} onChange={handleDropInputChange} options={reqs} optionLabel="name" placeholder="Requirement" className="w-full md:w-14rem" />
      </div>

      <div>
        <label>Attendants</label>
        <InputNumber name="attendants" placeholder="Attendants" value={patientInfo.attendants} onValueChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>Originating MTF</label> 
        <InputText name="originatingMtf" placeholder="Originating MTF" value={patientInfo.originatingMtf} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div> 

      <div>
        <label>Destination MTF</label> 
        <InputText name="destinationMtf" placeholder="Destination MTF" value={patientInfo.destinationMtf} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>Primary Med Spec</label>
        <InputText name="primaryMedSpec" placeholder="Primary Med Spec" value={patientInfo.primaryMedSpec} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>Primary Diagnosis</label>
        <InputText name="primaryDiagnosis" placeholder="Primary Diagnosis" value={patientInfo.primaryDiagnosis} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>Secondary Diagnosis</label>
        <InputText name="secondaryDiagnosis" placeholder="Secondary Diagnosis" value={patientInfo.secondaryDiagnosis} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>Other Diagnosis</label>
        <InputText name="otherDiagnosis" placeholder="Other Diagnosis" value={patientInfo.otherDiagnosis} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>E/PS</label>
        <InputText name="eps" value={patientInfo.eps} onChange={handleInputChange} required />
      </div>

      <div>
        <InputText name="eps" placeholder="E/PS" value={patientInfo.eps} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>E/PS</label>
        <InputText name="eps" value={patientInfo.eps} onChange={handleInputChange} required />
      </div>

      <div>
        <label>D/DS</label>
        <InputText name="dds" placeholder="D/DS" value={patientInfo.dds} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>UPR</label>
        <Dropdown name='upr' value={patientInfo.upr} onChange={handleDropInputChange} options={upr} optionLabel="name" placeholder="UPR" className="w-full md:w-14rem" />
      </div>

      <div>
        <label>Age</label>
        <InputNumber name="age" placeholder="Age" value={patientInfo.age} onValueChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>Gender</label>
        <Dropdown name='gender' value={patientInfo.gender} onChange={handleDropInputChange} options={gender} optionLabel="name" placeholder="Gender" className="w-full md:w-14rem" /> 
      </div>

      <div>
        <label>Weight</label>
        <InputNumber name="passengerWeight" placeholder="Passenger Weight" value={patientInfo.passengerWeight} onValueChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>Grade</label>
        <Dropdown name='grade' value={patientInfo.grade} onChange={handleDropInputChange} options={grade} optionLabel="name" placeholder="Grade" className="w-full md:w-14rem" />
      </div>

      <div>
        <label>Equipment</label>
        <InputText name="equipment" placeholder="Equipment" value={patientInfo.equipment} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>Diet</label>
        <InputText name="diet" placeholder="Diet" value={patientInfo.diet} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <InputText name="maxAlt" placeholder="Max Altitude" value={patientInfo.maxAlt} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </div>

      <div>
        <label>Spec</label>
        <Dropdown name='spec' value={patientInfo.spec} onChange={handleDropInputChange} options={spec} optionLabel="name" placeholder="Spec" className="w-full md:w-14rem" />
      </div>

      <div>
        <label>Special Team</label>
        <InputText name="specialTeam" placeholder="Special Team" value={patientInfo.specialTeam} onChange={handleInputChange} required style={{ marginRight: '10px' }} /> 
      </div>

      </form>
    </Card>

    <Button  label="Add Patient"  icon="pi pi-plus"  type="submit" className="p-button-success"/>
    
    <div style={{ marginTop: '20px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <ListBox 
        value={selectedPatient} 
        options={patients.map((patient) => ({
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {`${patient.first_name} ${patient.last_name} - ${patient.patient_id}`}
              <RadioButton 
                value={patient.id}  
                checked={selectedPatient === patient.id} 
              />
            </div>
          ),
          value: patient.id,
        }))}
        onChange={(e) => setSelectedPatient(e.value)}
        style={{ width: '100%' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {attendants.map(attendant => (
          <p key={attendant.first_name}>
            {`${attendant.first_name} ${attendant.last_name} - ${attendant.patient_id}`}
          </p>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
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
        <Button 
          label="Back" 
          icon="pi pi-arrow-left" 
          onClick={() => navigate('/home')} 
          className="p-button-secondary" 
        />
      </div>
    </div>
    
  </div>
);
}