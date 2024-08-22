import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { FloatLabel } from 'primereact/floatlabel';
import DarkModeToggle from '../DarkMode/DarkModeToggle';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/nova/theme.css';
import './Aircraft.css';

export default function AircraftCreate() {
    const navigate = useNavigate();
    const [aircraftInfo, setAircraftInfo] = useState({
        ac_name: '',
        ambulatory_left: null,
        litter_left: null,
        ambulatory_right: null,
        litter_right: null
    });

    const validateFields = () => {
        for (const key in aircraftInfo) {
            if (aircraftInfo[key] === '' || aircraftInfo[key] === null) {
                return false;
            }
        }
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAircraftInfo({ ...aircraftInfo, [name]: value });
    };

    const handleNumberChange = (e, name) => {
        setAircraftInfo({ ...aircraftInfo, [name]: e.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/aircraftcreate`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aircraftInfo)
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                setAircraftInfo({
                    ac_name: '',
                    ambulatory_left: null,
                    litter_left: null,
                    ambulatory_right: null,
                    litter_right: null
                });
            } else {
                console.error('Failed to update Aircraft');
            }
        } catch (error) {
            console.error('Error updating Aircraft:', error);
        }
    };

    const handleAllSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) {
            alert('Please fill in all the fields before submitting.');
            return;
        }
        await handleSubmit(e);
        navigate('/AircraftList');
    };

    return (
        <div className="aircraft-container">
            <Card title={`Create Your Aircraft`} className="card">
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
                            <InputNumber name="ambulatory_left" value={aircraftInfo.ambulatory_left} onValueChange={(e) => handleNumberChange(e, 'ambulatory_left')} required />
                        </FloatLabel>
                    </div>

                    <div className="edit-list">
                        <FloatLabel>
                            <label>Litter Left-Seats</label>
                            <InputNumber name="litter_left" value={aircraftInfo.litter_left} onValueChange={(e) => handleNumberChange(e, 'litter_left')} required />
                        </FloatLabel>
                    </div>

                    <div className="edit-list">
                        <FloatLabel>
                            <label>Ambulatory Right-Seats</label>
                            <InputNumber name="ambulatory_right" value={aircraftInfo.ambulatory_right} onValueChange={(e) => handleNumberChange(e, 'ambulatory_right')} required />
                        </FloatLabel>
                    </div>

                    <div className="edit-list">
                        <FloatLabel>
                            <label>Litter Right-Seats</label>
                            <InputNumber name="litter_right" value={aircraftInfo.litter_right} onValueChange={(e) => handleNumberChange(e, 'litter_right')} required />
                        </FloatLabel>
                    </div>

                    <div className="form-button">
                        <Button label="Create Aircraft" icon="pi pi-check" type="submit" className="p-button-success" />
                    </div>
                </form>
            </Card>
        </div>
    );
}
