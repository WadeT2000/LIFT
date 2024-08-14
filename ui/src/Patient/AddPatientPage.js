import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import {InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { FloatLabel } from 'primereact/floatlabel';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import addPatient from './AddPatient';
import 'primereact/resources/themes/nova/theme.css';
import './PatientEdit.css';




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
    // const reqs = [{ name: '1A'}, { name: '1L'}]
    // const upr = [{name: 'Routine'}, {name: 'Urgent'}, {name: 'Urgant Surgical'}, {name: 'Expectant'}]
    // const spec = [{name:'Y'}, {name:'N'}]
    // const gender = [{name: 'Male'}, {name: 'Female'}, {name: 'Non-Binary'}, {name: 'Trans-Male'}, {name: 'Trans-Female'}]
    // const grade = [{name: `E01`}, {name: `E02`}, {name: `E03`}, {name: `E04`}, {name: `E05`}, {name: `E06`}, {name: `E07`}, {name: `E08`}, {name: `O01`}, {name: `O02`}, {name: `O03`}, {name: `O04`}, {name: `O05`}, {name: `O06`}, {name: 'Civilian'}]
    // const attspec = [{name: 'Medical'}, {name: 'Non-Medical'}]

    const AddPatient = async (e) => {
        e.preventDefault();
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
    
      // const handleDropInputChange = (e) => {
      //   const { name } = e.target;
      //   const { value } = e;
      //   setPatientInfo({ ...patientInfo, [name]: value.name });
      // };

      const handleAttendantInputChange = (index, e) => {
        const { name, value } = e.target; 
        const updatedAttendants = [...attendantInfo];
        updatedAttendants[index] = {
            ...updatedAttendants[index],
            [name]: value,
        };
        setAttendantInfo(updatedAttendants);
      };
    
      // const handleAttendantDropInputChange = (index, e) => {
      //   const { name, value } = e.target;
      //   const updatedAttendants = [...attendantInfo];
      //   updatedAttendants[index] = {
      //       ...updatedAttendants[index],
      //       [name]: value.name,
      //   };
      //   setAttendantInfo(updatedAttendants);
      // };



      function addAttendants() {
        if(patientInfo.attendants === 0) {
          return null
        } else if(patientInfo.attendants > 0) {
          const attendantCards = [];
          for(let i = 0; i < patientInfo.attendants; i++) {
            attendantCards.push(
              <Card key={i} title={`Attendant ${i + 1}`} style={{ width: '100%', maxWidth: '600px', marginTop: '20px' }}>
                    <form onSubmit={AddPatient}>
                        <div className="edit-list">
                            <FloatLabel>
                                <label htmlFor={`firstname-${i}`}>First Name</label>
                                <InputText name="first_name" placeholder="First Name" value={attendantInfo[i]?.first_name || ''} onChange={(e) => handleAttendantInputChange(i, e)} required style={{ marginRight: '10px' }} />
                            </FloatLabel>
                        </div>

                        <div className="edit-list">
                            <FloatLabel>
                                <label htmlFor={`lastname-${i}`}>Last Name</label>
                                <InputText name="last_name" placeholder="Last Name" value={attendantInfo[i]?.last_name || ''} onChange={(e) => handleAttendantInputChange(i, e)} required style={{ marginRight: '10px' }} />
                            </FloatLabel>
                        </div>

                        <div className="edit-list">
                            <FloatLabel>
                                <label htmlFor={`enplane-${i}`}>Enplane</label>
                                <InputText name="enplane" placeholder="Enplane" value={attendantInfo[i]?.enplane || ''} onChange={(e) => handleAttendantInputChange(i, e)} required style={{ marginRight: '10px' }} />
                            </FloatLabel>
                        </div>

                        <div className="edit-list">
                            <FloatLabel>
                                <label htmlFor={`enplane-${i}`}>Deplane</label>
                                <InputText name="deplane" placeholder="Deplane" value={attendantInfo[i]?.deplane || ''} onChange={(e) => handleAttendantInputChange(i, e)} required style={{ marginRight: '10px' }} />
                            </FloatLabel>
                        </div>

                        <div className="edit-list">
                            <FloatLabel>
                                <label htmlFor={`age-${i}`}>Age</label>
                                <InputNumber name="age" placeholder="Age" value={attendantInfo[i]?.age || ''} onValueChange={(e) => handleAttendantInputChange(i, e)} required style={{ marginRight: '10px' }} />
                            </FloatLabel>
                        </div>

                        <div className="edit-list">
                            <FloatLabel>
                                <label htmlFor={`gender-${i}`}>Gender</label>
                                <InputText name="gender" value={attendantInfo[i]?.gender || ''} onChange={(e) => handleAttendantInputChange(i, e)} required style={{ marginRight: '10px' }} />
                            </FloatLabel>
                            {/* <Dropdown name="gender" placeholder="Gender" value={attendantInfo[i]?.gender || ''} onChange={(e) => handleAttendantDropInputChange(i, e)} options={gender} optionLabel="name" className="w-full md:w-14rem" /> */}
                        </div>

                        <div className="edit-list">
                            <FloatLabel>
                                <label>Weight</label>
                                <InputNumber name="passenger_weight" value={attendantInfo[i]?.passenger_weight || ''} onValueChange={(e) => handleAttendantInputChange(i, e)} required style={{ marginRight: '10px' }} />
                            </FloatLabel>
                        </div>

                        <div className="edit-list">
                            <FloatLabel>
                                <label htmlFor={`grade-${i}`}>Grade</label>
                                <InputText name="grade" value={attendantInfo[i]?.grade || ''} onChange={(e) => handleAttendantInputChange(i, e)} required style={{ marginRight: '10px' }} />
                            </FloatLabel>
                            {/* <Dropdown name="grade" placeholder="Grade" value={attendantInfo[i]?.grade || ''} onChange={(e) => handleAttendantDropInputChange(i, e)} options={grade} optionLabel="name" className="w-full md:w-14rem" /> */}
                        </div>


                        <div className="edit-list">
                            <FloatLabel>
                                <label htmlFor={`attendant_specialty-${i}`}>Attendant Specialty</label>
                                <InputText name="attendant_specialty" value={attendantInfo[i]?.attendant_specialty || ''} onChange={(e) => handleAttendantInputChange(i, e)} required style={{ marginRight: '10px' }} />
                            </FloatLabel>
                            {/* <Dropdown name="attendant_specialty" placeholder="Attendant Specialty" value={attendantInfo[i]?.attendant_specialty || ''} onChange={(e) => handleAttendantDropInputChange(i, e)} options={attspec} optionLabel="name" className="w-full md:w-14rem" /> */}
                        </div>
                    </form>
                </Card>
            );
        }
        return <>{attendantCards}</>;
    }
  }


    return (
     <div className="container">
        <Card title="Patient List" className='card'>
      <form onSubmit={AddPatient} className='form-grid'>
        
      <div className="edit-list">
        <FloatLabel>
        <label htmlFor="firstname">First Name</label>
        <InputText name="firstName" value={patientInfo.firstName || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
      </div>

        <div className="edit-list">
          <FloatLabel>
            <label htmlFor="lastname">Last Name</label>
            <InputText name="last_name" value={patientInfo.last_name || ''} onChange={handleInputChange} required style={{marginRight: '10px' }} />
          </FloatLabel>
        </div>

        <div className="edit-list">
          <FloatLabel>
            <label htmlFor="patientid">Patient Id</label>
            <InputNumber name='patientId' value={patientInfo.patientId || ''} onValueChange={handleInputChange} required useGrouping={false} style={{ marginRight: '10px' }} />
          </FloatLabel>
        </div>

        <div className="edit-list">
          <FloatLabel> 
            <label htmlFor="casualtyevent">Casualty Event</label>
            <InputText name="casualtyEvent" value={patientInfo.casualtyEvent || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
          </FloatLabel>
        </div>
        
        <div className="edit-list">
          <FloatLabel>
            <label htmlFor='requirements'>Requirements</label>
            <InputText name='requirements' value={patientInfo.requirements || ''} onChange={handleInputChange} required style={{ marginRight: '10px'}} />
          </FloatLabel>
          {/* <Dropdown className='dropdown-box' name='requirements' value={patientInfo.requirements || ''} onChange={(e) => setPatientInfo({ ...patientInfo, requirements: e.value.name })} options={reqs} optionLabel="name" placeholder="Requirements" /> */}
        </div>
        
        <div className="edit-list">
          <FloatLabel>
            <label htmlFor="attendants">Attendants</label>
            <InputNumber name="attendants" value={patientInfo.attendants || 0} onValueChange={(e) => setPatientInfo({...patientInfo, attendants: e.value})} min={0} required style={{ marginRight: '10px' }} />
          </FloatLabel>
        </div>
        
        <div className="edit-list">
          <FloatLabel>
            <label htmlFor="orginatingmtf">Originating MTF</label> 
            <InputText name="originatingMtf" value={patientInfo.originatingMtf || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
          </FloatLabel>
        </div>

        <div className="edit-list">
          <FloatLabel>
        <label htmlFor="destinationmtf">Destination MTF</label> 
        <InputText name="destinationMtf"  value={patientInfo.destinationMtf || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
        </div>

      <div className="edit-list">
        <FloatLabel>
        <label htmlFor="primarymedspec">Primary Med Spec</label>
        <InputText name="primaryMedSpec"  value={patientInfo.primaryMedSpec || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
        </div>

      <div className="edit-list">
        <FloatLabel>
        <label htmlFor="primarydiagnosis">Primary Diagnosis</label>
        <InputText name="primaryDiagnosis" value={patientInfo.primaryDiagnosis || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
        </div>

      <div className="edit-list">
        <FloatLabel>
          <label htmlFor="secondarydiagnosis">Secondary Diagnosis</label>
          <InputText name="secondaryDiagnosis"  value={patientInfo.secondaryDiagnosis || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
      </div>

      <div className="edit-list">
        <FloatLabel>
        <label htmlFor="otherdiagnosis">Other Diagnosis</label>
        <InputText name="otherDiagnosis"  value={patientInfo.otherDiagnosis || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
      </div>

      <div className="edit-list">
        <FloatLabel>
        <label htmlFor="eps">E/PS</label>
        <InputText name="eps" value={patientInfo.eps || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }}/>
        </FloatLabel>
      </div>

      <div className="edit-list">
        <FloatLabel>
          <label htmlFor="dds">D/DS</label>
         <InputText name="dds"  value={patientInfo.dds || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
      </div>

      <div className="edit-list">
      <FloatLabel>
          <label htmlFor="upr">UPR</label>
         <InputText name="upr"  value={patientInfo.upr || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
        {/* <Dropdown name='upr' value={patientInfo.upr || ''} onChange={(e) => setPatientInfo({ ...patientInfo, upr: e.value.name })} options={upr} optionLabel="name" className='dropdown-box' /> */}
      </div>

      <div className="edit-list">
      <FloatLabel>
        <label htmlFor="age">Age</label>
        <InputNumber name="age"  value={patientInfo.age || ''} onValueChange={handleInputChange} required style={{ marginRight: '10px' }} />
      </FloatLabel>
      </div>

      <div className="edit-list">
        <FloatLabel>
          <label htmlFor="gender">Gender</label>
          <InputText name="gender"  value={patientInfo.gender || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
        {/* <Dropdown name='gender' value={patientInfo.gender || ''} onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.value.name })} options={gender} optionLabel="name" placeholder="Gender" className='dropdown-box' />  */}
      </div>

      <div className="edit-list">
        <FloatLabel>
          <label>Weight</label>
          <InputNumber name="passengerWeight" placeholder="Passenger Weight" value={patientInfo.passengerWeight || ''} onValueChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
      </div>

      <div className="edit-list">
        <FloatLabel>
          <label htmlFor="grade">Grade</label>
          <InputText name="grade"  value={patientInfo.grade || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
        {/* <Dropdown name='grade' value={patientInfo.grade || ''} onChange={(e) => setPatientInfo({ ...patientInfo, grade: e.value.name })} options={grade} optionLabel="name"  className='dropdown-box' /> */}
      </div>

      <div className="edit-list">
        <FloatLabel>
          <label htmlFor="equipment">Equipment</label>
          <InputText name="equipment"  value={patientInfo.equipment || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
      </div>

      <div className="edit-list">
        <FloatLabel>
          <label htmlFor='diet'>Diet</label>
          <InputText name="diet"  value={patientInfo.diet || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
      </div>

      <div className="edit-list">
        <FloatLabel>
          <label htmlFor='maxalt'>Max Altitude</label>
          <InputText name="maxAlt" placeholder="Max Altitude" value={patientInfo.maxAlt || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
      </div>

      <div className="edit-list">
        <FloatLabel>
          <label htmlFor='spec'>Spec</label>
          <InputText name="spec"  value={patientInfo.spec || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} />
        </FloatLabel>
        {/* <Dropdown className='dropdown-box' name='spec' value={patientInfo.spec || ''} onChange={(e) => setPatientInfo({ ...patientInfo, spec: e.value.name })} options={spec} optionLabel="name" placeholder="Spec" /> */}
      </div>

      <div className="edit-list">
        <FloatLabel>
          <label htmlFor="specialteam">Special Team</label>
          <InputText name="specialTeam"  value={patientInfo.specialTeam || ''} onChange={handleInputChange} required style={{ marginRight: '10px' }} /> 
        </FloatLabel>
      </div>
      {addAttendants()}
      </form>
    </Card>
    <Button  label="Add Passengers"  icon="pi pi-plus"  onClick={AddPatient} className="p-button-success"/>

    </div>
    )
}
