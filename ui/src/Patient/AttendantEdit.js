import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { FloatLabel } from "primereact/floatlabel";
import  DarkModeToggle from '../DarkMode/DarkModeToggle';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './PatientEdit.css';


export default function AttendantEdit() {
    const navigate = useNavigate();
    const { attendantid } = useParams();
    const [attendant, setAttendant] = useState([]);
    
    useEffect(() => {
        fetch(`http://localhost:8080/attendantm1/${attendantid}`)
        .then(res => res.json())
        .then(data => {
            console.log(data[0])
            setAttendant(data[0])
        })
    }, [attendantid])

    const handleAttendantAdjustInputChange = (e) => {
        const { name, value } = e.target;
        setAttendant((prevInfo) => {
          const updatedInfo = { ...prevInfo, [name]: value };
    });
    }

    const handleAttendantAdjustmentSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`http://localhost:8080/attendant1`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(attendant)
        });
    
        if (response.ok) {
            const data = await response.json();
            alert(data.message);
        } else {
            console.error('Failed to update item');
        }
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }

    const validateFields = () => {
      for (const attendant of attendant) {
        for (const key in attendant) {
            if (attendant[key] === '' || attendant[key] === null) {
                return false;
            }
        }
    }
      return true;
  };

    const handleAllSubmit = async (e) => {
      e.preventDefault();
      if (!validateFields()) {
        alert('Please fill in all the fields before submitting.');
        return;
    }
    await handleAttendantAdjustmentSubmit(e);
    navigate('/PatientList');
    }

    
//${attendant.first_name} ${attendant.last_name}
    return (
      <div className="container">
          <Card title={`Attendant Info`} className="card">
          <div className="darkmode-container">
            <DarkModeToggle />
          </div>
              <form className="form-grid" onSubmit={handleAllSubmit}>
              <div className="edit-list">
                            <FloatLabel>
                                <label>First Name</label>
                                <InputText name="first_name" placeholder="First Name" value={attendant.first_name} onChange={(e) => handleAttendantAdjustInputChange(e)} required  />
                            </FloatLabel>
                        </div>

                        <div className="edit-list">
                            <FloatLabel>
                                <label>Last Name</label>
                                <InputText name="last_name" placeholder="Last Name" value={attendant.last_name} onChange={(e) => handleAttendantAdjustInputChange(e)} required  />
                            </FloatLabel>
                        </div>

                        <div className="edit-list">
                            <FloatLabel>
                                <label>Enplane</label>
                                <InputText name="enplane" placeholder="Enplane" value={attendant.enplane} onChange={(e) => handleAttendantAdjustInputChange(e)} required />
                            </FloatLabel>
                        </div>

                        <div className="edit-list">
                            <FloatLabel>
                                <label>Deplane</label>
                                <InputText name="deplane" placeholder="Deplane" value={attendant.deplane} onChange={(e) => handleAttendantAdjustInputChange(e)} required />
                            </FloatLabel>
                        </div>

                        <div className="edit-list">
                            <FloatLabel>
                                <label>Age</label>
                                <InputNumber name="age" placeholder="Age" value={attendant.age} onValueChange={(e) => handleAttendantAdjustInputChange(e)} required />
                            </FloatLabel>
                        </div>

                        <div className="edit-list">
                            <FloatLabel>
                                <label>Gender</label>
                                <InputText name="gender" value={attendant.gender} onChange={(e) => handleAttendantAdjustInputChange(e)} required />
                            </FloatLabel>
                        </div>

                        <div className="edit-list">
                            <FloatLabel>
                                <label>Weight</label>
                                <InputNumber name="passenger_weight" value={attendant.passenger_weight} onValueChange={(e) => handleAttendantAdjustInputChange(e)} required  />
                            </FloatLabel>
                        </div>

                        <div className="edit-list">
                            <FloatLabel>
                                <label>Grade</label>
                                <InputText name="grade" value={attendant.grade} onChange={(e) => handleAttendantAdjustInputChange(e)} required />
                            </FloatLabel>
                        </div>


                        <div className="edit-list">
                            <FloatLabel>
                                <label>Attendant Specialty</label>
                                <InputText name="attendant_specialty" value={attendant.attendant_specialty} onChange={(e) => handleAttendantAdjustInputChange(e)} required />
                            </FloatLabel>
                        </div>
                        <div className="form-button">
                            <Button label="Commit Changes" icon="pi pi-check" type="submit" className="p-button-success"/>
                        </div>                  
              </form>
          </Card>
      </div>
  );
}