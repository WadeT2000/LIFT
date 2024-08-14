import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './PatientEdit.css';

export default function PatientEdit() {
    const navigate = useNavigate();
    const { patientid } = useParams();
    const [patientInfo, setPatientInfo] = useState({
        id: `${patientid}`,
        first_name: '',
        last_name: '',
        patient_id: '',
        casualty_event: '',
        requirements: '',
        attendants: '',
        originating_mtf: '',
        destination_mtf: '',
        primary_med_spec: '',
        primary_diagnosis: '',
        secondary_diagnosis: '',
        other_diagnosis: '',
        eps: '',
        dds: '',
        upr: '', 
        age: '',
        gender: '',
        passenger_weight: '',
        grade: '', 
        equipment: '',
        diet: '',
        max_alt: '',
        spec: '',  
        special_team: '', 
      });
      

    useEffect(() => {
        fetch(`http://localhost:8080/patientsmission1?search=${patientid}`)
        .then(res => res.json())
        .then(data => {
            setPatientInfo(data[0])
    });
    }, [patientid])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientInfo(prevState => ({ ...prevState, [name]: value }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/patientmission1/${patientInfo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(patientInfo)
            });
    
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                navigate('/PatientList');
            } else {
                console.error('Failed to update item');
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };



    return (
      <div className="container">
          <Card title={`${patientInfo.first_name} ${patientInfo.last_name}'s Info`} className="card">
              <form onSubmit={handleSubmit} className="form-grid">
                  <label>First Name</label>
                  <InputText name="first_name" value={patientInfo.first_name} onChange={handleInputChange} required />
  
                  <label>Last Name</label>
                  <InputText name="last_name" value={patientInfo.last_name} onChange={handleInputChange} required />
  
                  <label>Patient ID</label>
                  <InputNumber name="patient_id" value={patientInfo.patient_id} onValueChange={handleInputChange} required useGrouping={false} />
  
                  <label>Casualty Event</label>
                  <InputText name="casualty_event" value={patientInfo.casualty_event} onChange={handleInputChange} required />
  
                  <label>Requirements</label>
                  <InputText name="requirements" value={patientInfo.requirements} onChange={handleInputChange} required />
  
                  <label>Attendants</label>
                  <InputNumber name="attendants" value={patientInfo.attendants} onValueChange={handleInputChange} required />
  
                  <label>Originating MTF</label>
                  <InputText name="originating_mtf" value={patientInfo.originating_mtf} onChange={handleInputChange} required />
  
                  <label>Destination MTF</label>
                  <InputText name="destination_mtf" value={patientInfo.destination_mtf} onChange={handleInputChange} required />
  
                  <label>Primary Med Spec</label>
                  <InputText name="primary_med_spec" value={patientInfo.primary_med_spec} onChange={handleInputChange} required />
  
                  <label>Primary Diagnosis</label>
                  <InputText name="primary_diagnosis" value={patientInfo.primary_diagnosis} onChange={handleInputChange} required />
  
                  <label>Secondary Diagnosis</label>
                  <InputText name="secondary_diagnosis" value={patientInfo.secondary_diagnosis} onChange={handleInputChange} required />
  
                  <label>Other Diagnosis</label>
                  <InputText name="other_diagnosis" value={patientInfo.other_diagnosis} onChange={handleInputChange} required />
  
                  <label>E/PS</label>
                  <InputText name="eps" value={patientInfo.eps} onChange={handleInputChange} required />
  
                  <label>D/DS</label>
                  <InputText name="dds" value={patientInfo.dds} onChange={handleInputChange} required />
  
                  <label>UPR</label>
                  <InputText name="upr" value={patientInfo.upr} onChange={handleInputChange} required />
  
                  <label>Age</label>
                  <InputNumber name="age" value={patientInfo.age} onValueChange={handleInputChange} required />
  
                  <label>Gender</label>
                  <InputText name="gender" value={patientInfo.gender} onChange={handleInputChange} required />
  
                  <label>Weight</label>
                  <InputNumber name="passenger_weight" value={patientInfo.passenger_weight} onValueChange={handleInputChange} required />
  
                  <label>Grade</label>
                  <InputText name="grade" value={patientInfo.grade} onChange={handleInputChange} required />
  
                  <label>Equipment</label>
                  <InputText name="equipment" value={patientInfo.equipment} onChange={handleInputChange} required />
  
                  <label>Diet</label>
                  <InputText name="diet" value={patientInfo.diet} onChange={handleInputChange} required />
  
                  <label>Altitude Restriction</label>
                  <InputText name="max_alt" value={patientInfo.max_alt} onChange={handleInputChange} required />
  
                  <label>Spec</label>
                  <InputText name="spec" value={patientInfo.spec} onChange={handleInputChange} required />
  
                  <label>Specialty Team</label>
                  <InputText name="special_team" value={patientInfo.special_team} onChange={handleInputChange} required />
  
                  <div className="form-button">
                      <Button label="Commit Changes" icon="pi pi-check" type="submit" className="p-button-success"/>
                  </div>
              </form>
          </Card>
      </div>
  );
}