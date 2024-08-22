import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import {InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { FloatLabel } from 'primereact/floatlabel';
import addPatient from './AddPatient';
import  DarkModeToggle from '../DarkMode/DarkModeToggle';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/nova/theme.css';
import './AddPatientPage.css';



export default function AddPatientPage() {
  const navigate = useNavigate();
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
    const [attendantInfo, setAttendantInfo] = useState([]);


    const validateFields = () => {
      console.log("patient info:", patientInfo)
      console.log("attendant info:", attendantInfo)
      for (const key in patientInfo) {
          if (patientInfo[key] === '' || patientInfo[key] === null) {
              return false;
          }
      }
      return true;
  };

  const AddPatient = async (e) => {
      e.preventDefault();
      if (!validateFields()) {
        alert('Please fill in all the fields before submitting.');
        return;
    }
      const status = await addPatient( patientInfo, attendantInfo);
      alert(status.message);
      if(status.message === "Patient and Attendants Added to the list") {
      navigate('/PatientList');
      }
    }

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setPatientInfo({ ...patientInfo, [name]: value });
    };

    const handleAttendantInputChange = (index, e) => {
      const { name, value } = e.target; 
      const updatedAttendants = [...attendantInfo];
      updatedAttendants[index] = {
          ...updatedAttendants[index],
          [name]: value,
      };
      setAttendantInfo(updatedAttendants);
    };

    function addAttendants() {
      if(patientInfo.attendants === 0) {
        return null
      } else if(patientInfo.attendants > 0) {
        const attendantCards = [];
        for(let i = 0; i < patientInfo.attendants; i++) {
          attendantCards.push(
          <div className='attendant-container'>
            <Card key={i} title={`Attendant ${i + 1}`} className='attendant-title' >
                  <form onSubmit={AddPatient}>
                      <div className="attendant-edit-list">
                          <FloatLabel>
                              <label htmlFor={`firstname-${i}`}>First Name</label>
                              <InputText name="first_name" placeholder="First Name" value={attendantInfo[i]?.first_name || ''} onChange={(e) => handleAttendantInputChange(i, e)} required />
                          </FloatLabel>
                      </div>

                      <div className="attendant-edit-list">
                          <FloatLabel>
                              <label htmlFor={`lastname-${i}`}>Last Name</label>
                              <InputText name="last_name" placeholder="Last Name" value={attendantInfo[i]?.last_name || ''} onChange={(e) => handleAttendantInputChange(i, e)} required  />
                          </FloatLabel>
                      </div>

                      <div className="attendant-edit-list">
                          <FloatLabel>
                              <label htmlFor={`enplane-${i}`}>Enplane</label>
                              <InputText name="enplane" placeholder="Enplane" value={attendantInfo[i]?.enplane || ''} onChange={(e) => handleAttendantInputChange(i, e)} required />
                          </FloatLabel>
                      </div>

                      <div className="attendant-edit-list">
                          <FloatLabel>
                              <label htmlFor={`enplane-${i}`}>Deplane</label>
                              <InputText name="deplane" placeholder="Deplane" value={attendantInfo[i]?.deplane || ''} onChange={(e) => handleAttendantInputChange(i, e)} required />
                          </FloatLabel>
                      </div>

                      <div className="attendant-edit-list">
                          <FloatLabel>
                              <label htmlFor={`age-${i}`}>Age</label>
                              <InputNumber name="age" placeholder="Age" value={attendantInfo[i]?.age || ''} onValueChange={(e) => handleAttendantInputChange(i, e)} required />
                          </FloatLabel>
                      </div>

                      <div className="attendant-edit-list">
                          <FloatLabel>
                              <label htmlFor={`gender-${i}`}>Gender</label>
                              <InputText name="gender" value={attendantInfo[i]?.gender || ''} onChange={(e) => handleAttendantInputChange(i, e)} required />
                          </FloatLabel>
                      </div>

                      <div className="attendant-edit-list">
                          <FloatLabel>
                              <label>Weight</label>
                              <InputNumber name="passenger_weight" value={attendantInfo[i]?.passenger_weight || ''} onValueChange={(e) => handleAttendantInputChange(i, e)} required  />
                          </FloatLabel>
                      </div>

                      <div className="attendant-edit-list">
                          <FloatLabel>
                              <label htmlFor={`grade-${i}`}>Grade</label>
                              <InputText name="grade" value={attendantInfo[i]?.grade || ''} onChange={(e) => handleAttendantInputChange(i, e)} required />
                          </FloatLabel>
                      </div>


                      <div className="attendant-edit-list">
                          <FloatLabel>
                              <label htmlFor={`attendant_specialty-${i}`}>Attendant Specialty</label>
                              <InputText name="attendant_specialty" value={attendantInfo[i]?.attendant_specialty || ''} onChange={(e) => handleAttendantInputChange(i, e)} required />
                          </FloatLabel>
                      </div>
                  </form>
              </Card>
            </div>
          );
      }
      return <>{attendantCards}</>;
    }
  }

    return (
      <div className="patient-container">
          <Card title="Patient List" className='patient-card'>
          <Button
                label="Back"
                icon="pi pi-arrow-left"
                onClick={() => navigate('/PatientList')}
                className="p-button-secondary"
              />
        <form onSubmit={AddPatient} className='form-grid'>
          
        <div className="edit-list">
          <FloatLabel>
          <label htmlFor="firstname">First Name</label>
          <InputText name="firstName" value={patientInfo.firstName || ''} onChange={handleInputChange} required/>
          </FloatLabel>
        </div>

          <div className="edit-list">
            <FloatLabel>
              <label htmlFor="lastname">Last Name</label>
              <InputText name="lastName" value={patientInfo.lastName || ''} onChange={handleInputChange} required/>
            </FloatLabel>
          </div>

          <div className="edit-list">
            <FloatLabel>
              <label htmlFor="patientid">Patient Id</label>
              <InputNumber name='patientId' value={patientInfo.patientId || ''} onValueChange={handleInputChange} required useGrouping={false}  />
            </FloatLabel>
          </div>

          <div className="edit-list">
            <FloatLabel> 
              <label htmlFor="casualtyevent">Casualty Event</label>
              <InputText name="casualtyEvent" value={patientInfo.casualtyEvent || ''} onChange={handleInputChange} required  />
            </FloatLabel>
          </div>
          
          <div className="edit-list">
            <FloatLabel>
              <label htmlFor='requirements'>Requirements</label>
              <InputText name='requirements' value={patientInfo.requirements || ''} onChange={handleInputChange} required  />
            </FloatLabel>
          </div>
          
          <div className="edit-list">
            <FloatLabel>
              <label htmlFor="attendants">Attendants</label>
              <InputNumber name="attendants" value={patientInfo.attendants || 0} onValueChange={(e) => setPatientInfo({...patientInfo, attendants: e.value})} min={0} max={15} required  />
            </FloatLabel>
          </div>
          
          <div className="edit-list">
            <FloatLabel>
              <label htmlFor="orginatingmtf">Originating MTF</label> 
              <InputText name="originatingMtf" value={patientInfo.originatingMtf || ''} onChange={handleInputChange} required />
            </FloatLabel>
          </div>

          <div className="edit-list">
            <FloatLabel>
          <label htmlFor="destinationmtf">Destination MTF</label> 
          <InputText name="destinationMtf"  value={patientInfo.destinationMtf || ''} onChange={handleInputChange} required />
          </FloatLabel>
          </div>

        <div className="edit-list">
          <FloatLabel>
          <label htmlFor="primarymedspec">Primary Med Spec</label>
          <InputText name="primaryMedSpec"  value={patientInfo.primaryMedSpec || ''} onChange={handleInputChange} required />
          </FloatLabel>
          </div>

        <div className="edit-list">
          <FloatLabel>
          <label htmlFor="primarydiagnosis">Primary Diagnosis</label>
          <InputText name="primaryDiagnosis" value={patientInfo.primaryDiagnosis || ''} onChange={handleInputChange} required  />
          </FloatLabel>
          </div>

        <div className="edit-list">
          <FloatLabel>
            <label htmlFor="secondarydiagnosis">Secondary Diagnosis</label>
            <InputText name="secondaryDiagnosis"  value={patientInfo.secondaryDiagnosis || ''} onChange={handleInputChange} required  />
          </FloatLabel>
        </div>

        <div className="edit-list">
          <FloatLabel>
          <label htmlFor="otherdiagnosis">Other Diagnosis</label>
          <InputText name="otherDiagnosis"  value={patientInfo.otherDiagnosis || ''} onChange={handleInputChange} required />
          </FloatLabel>
        </div>

        <div className="edit-list">
          <FloatLabel>
          <label htmlFor="eps">E/PS</label>
          <InputText name="eps" value={patientInfo.eps || ''} onChange={handleInputChange} required />
          </FloatLabel>
        </div>

        <div className="edit-list">
          <FloatLabel>
            <label htmlFor="dds">D/DS</label>
          <InputText name="dds"  value={patientInfo.dds || ''} onChange={handleInputChange} required  />
          </FloatLabel>
        </div>

        <div className="edit-list">
        <FloatLabel>
            <label htmlFor="upr">UPR</label>
          <InputText name="upr"  value={patientInfo.upr || ''} onChange={handleInputChange} required  />
          </FloatLabel>
        </div>

        <div className="edit-list">
        <FloatLabel>
          <label htmlFor="age">Age</label>
          <InputNumber name="age"  value={patientInfo.age || ''} onValueChange={handleInputChange} required  />
        </FloatLabel>
        </div>

        <div className="edit-list">
          <FloatLabel>
            <label htmlFor="gender">Gender</label>
            <InputText name="gender"  value={patientInfo.gender || ''} onChange={handleInputChange} required  />
          </FloatLabel>
        </div>

        <div className="edit-list">
          <FloatLabel>
            <label>Weight</label>
            <InputNumber name="passengerWeight" placeholder="Passenger Weight" value={patientInfo.passengerWeight || ''} onValueChange={handleInputChange} required  />
          </FloatLabel>
        </div>

        <div className="edit-list">
          <FloatLabel>
            <label htmlFor="grade">Grade</label>
            <InputText name="grade"  value={patientInfo.grade || ''} onChange={handleInputChange} required  />
          </FloatLabel>
        </div>

        <div className="edit-list">
          <FloatLabel>
            <label htmlFor="equipment">Equipment</label>
            <InputText name="equipment"  value={patientInfo.equipment || ''} onChange={handleInputChange} required />
          </FloatLabel>
        </div>

        <div className="edit-list">
          <FloatLabel>
            <label htmlFor='diet'>Diet</label>
            <InputText name="diet"  value={patientInfo.diet || ''} onChange={handleInputChange} required />
          </FloatLabel>
        </div>

        <div className="edit-list">
          <FloatLabel>
            <label htmlFor='maxalt'>Max Altitude</label>
            <InputText name="maxAlt" value={patientInfo.maxAlt || ''} onChange={handleInputChange} required  />
          </FloatLabel>
        </div>

        <div className="edit-list">
          <FloatLabel>
            <label htmlFor='spec'>Spec</label>
            <InputText name="spec"  value={patientInfo.spec || ''} onChange={handleInputChange} required  />
          </FloatLabel>
        </div>

        <div className="edit-list">
          <FloatLabel>
            <label htmlFor="specialteam">Special Team</label>
            <InputText name="specialTeam"  value={patientInfo.specialTeam || ''} onChange={handleInputChange} required  /> 
          </FloatLabel>
        </div>
        {addAttendants()}
        </form>
          <Button label="Add Passengers"  icon="pi pi-plus"  onClick={AddPatient} className="p-button-success"/>
        <div className="darkmode-container">
          <DarkModeToggle />
        </div>
      </Card>
      </div>
      )
}
