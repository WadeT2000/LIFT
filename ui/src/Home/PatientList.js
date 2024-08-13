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

  useEffect(() => {
    fetch('http://localhost:8080/patientsmission1').then(res => res.json()).then(data => setPatients(data));
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
  <div style={{ padding: '20px', textAlign: 'center' }}>
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
        <InputText name="firstName" placeholder="First Name" value={patientInfo.firstName} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        <InputText name="lastName" placeholder="Last Name" value={patientInfo.lastName} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        <InputNumber name='patientId' placeholder='Patient Id' value={patientInfo.patientId} onValueChange={handleInputChange} required style={{ marginRight: '10px' }} useGrouping={false}/>
        <InputText name="casualtyEvent" placeholder="Casualty Event" value={patientInfo.casualtyEvent} onChange={handleInputChange} required style={{ marginRight: '10px' }} /> 
        <Dropdown name='requirements' value={patientInfo.requirements} onChange={handleDropInputChange} options={reqs} optionLabel="name" placeholder="Requirement" className="w-full md:w-14rem" />
        <InputNumber name="attendants" placeholder="Attendants" value={patientInfo.attendants} onValueChange={handleInputChange} required style={{ marginRight: '10px' }} /> 
        <InputText name="originatingMtf" placeholder="Originating MTF" value={patientInfo.originatingMtf} onChange={handleInputChange} required style={{ marginRight: '10px' }} /> 
        <InputText name="destinationMtf" placeholder="Destination MTF" value={patientInfo.destinationMtf} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        <InputText name="primaryMedSpec" placeholder="Primary Med Spec" value={patientInfo.primaryMedSpec} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        <InputText name="primaryDiagnosis" placeholder="Primary Diagnosis" value={patientInfo.primaryDiagnosis} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        <InputText name="secondaryDiagnosis" placeholder="Secondary Diagnosis" value={patientInfo.secondaryDiagnosis} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        <InputText name="otherDiagnosis" placeholder="Other Diagnosis" value={patientInfo.otherDiagnosis} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        <InputText name="eps" placeholder="E/PS" value={patientInfo.eps} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        <InputText name="dds" placeholder="D/DS" value={patientInfo.dds} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        <Dropdown name='upr' value={patientInfo.upr} onChange={handleDropInputChange} options={upr} optionLabel="name" placeholder="UPR" className="w-full md:w-14rem" />
        <InputNumber name="age" placeholder="Age" value={patientInfo.age} onValueChange={handleInputChange} required style={{ marginRight: '10px' }} />
        <Dropdown name='gender' value={patientInfo.gender} onChange={handleDropInputChange} options={gender} optionLabel="name" placeholder="Gender" className="w-full md:w-14rem" /> 
        <InputNumber name="passengerWeight" placeholder="Passenger Weight" value={patientInfo.passengerWeight} onValueChange={handleInputChange} required style={{ marginRight: '10px' }} />
        <Dropdown name='grade' value={patientInfo.grade} onChange={handleDropInputChange} options={grade} optionLabel="name" placeholder="Grade" className="w-full md:w-14rem" />
        <InputText name="equipment" placeholder="Equipment" value={patientInfo.equipment} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        <InputText name="diet" placeholder="Diet" value={patientInfo.diet} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        <InputText name="maxAlt" placeholder="Max Altitude" value={patientInfo.maxAlt} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        <Dropdown name='spec' value={patientInfo.spec} onChange={handleDropInputChange} options={spec} optionLabel="name" placeholder="Spec" className="w-full md:w-14rem" />
        <InputText name="specialTeam" placeholder="Special Team" value={patientInfo.specialTeam} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
          <Button  label="Add Patient"  icon="pi pi-plus"  type="submit" className="p-button-success"/>
      </form>
    </Card>

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