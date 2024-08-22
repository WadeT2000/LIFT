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
import './Aircraft.css';


export default function AircraftEdit() {
    const navigate = useNavigate();
    const { aircraftid } = useParams();
    const [aircraftInfo, setAircraftInfo] = useState([]);


      useEffect(() => {
        fetch(`http://localhost:8080/aircraftid?search=${aircraftid}`)
        .then(res => res.json())
        .then(data => {
            setAircraftInfo(data[0])
        });
      }, [aircraftid])
      
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAircraftInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));
    };


      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/aircraftedit/${aircraftInfo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(aircraftInfo)
            });
    
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
            } else {
                console.error('Failed to update Aircraft');
            }
        } catch (error) {
            console.error('Error updating Aircraft:', error);
        }
    };


    const validateFields = () => {
        for (const key in aircraftInfo) {
            if (aircraftInfo[key] === '' || aircraftInfo[key] === null) {
                return false;
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
    await handleSubmit(e);
    navigate('/AircraftList');
    }

    return (
      <div className="aircraft-container">
          <Card title={`${aircraftInfo.ac_name}'s Info`} className="card">
          <div className="darkmode-container">
            <DarkModeToggle />
          </div>
              
              <form className="form-grid" onSubmit={handleAllSubmit}>

                <div className="edit-list">
                <FloatLabel>
                  <label>Aircraft Name</label>
                  <InputText name="ac_name" value={aircraftInfo.ac_name} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                <FloatLabel>
                  <label>Ambulatory Left-Seats</label>
                  <InputNumber name="ambulatory_left" value={aircraftInfo.ambulatory_left} onValueChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                <FloatLabel>
                  <label>Litter Left-Seats</label>
                  <InputNumber name="litter_left" value={aircraftInfo.litter_left} onValueChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                <FloatLabel>
                  <label>Ambulatory Right-Seats</label>
                  <InputNumber name="ambulatory_right" value={aircraftInfo.ambulatory_right} onValueChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                <FloatLabel>
                  <label>Litter Right-Seats</label>
                  <InputNumber name="litter_right" value={aircraftInfo.litter_right} onValueChange={handleInputChange} required />
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