import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import { RadioButton } from 'primereact/radiobutton';
import DarkModeToggle from '../DarkMode/DarkModeToggle';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Aircraft.css';

function PreviewAmbulatory({ length, location }) {
    return (
        <div className={`Ambulatory ${location}`}>
            {[...Array(length)].map((_, index) => (
                <div key={index} className="AmbulatorySlot">
                    {`${location}_${index}`}
                </div>
            ))}
        </div>
    );
}

function PreviewLitter({ length, location }) {
    return (
        <div className={`Litter ${location}`}>
            {[...Array(length)].map((_, index) => (
                <div key={index} className="LitterSlot">
                    {`${location}_${index}`}
                </div>
            ))}
        </div>
    );
}

export default function AircraftList() {
    const navigate = useNavigate();
    const [aircrafts, setAircrafts] = useState([]);
    const [planeData, setPlaneData] = useState(null);
    const [selectedAircraft, setSelectedAircraft] = useState(null);

    async function deleteAircraft(aircraftId) {
        try {
            const response = await fetch(`http://localhost:8080/aircraftdelete/${aircraftId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                setAircrafts(aircrafts.filter(aircraft => aircraft.id !== aircraftId));
                setSelectedAircraft(null);
                setPlaneData(null);
            } else {
                console.error("Failed to delete Aircraft");
            }
        } catch (error) {
            console.error("Error deleting Aircraft:", error);
        }
    }

    function handleAircraftChange(aircraftId) {
        setSelectedAircraft(aircraftId);
        const selectedPlane = aircrafts.find(ac => ac.id === aircraftId);
        setPlaneData(selectedPlane);
    }

    useEffect(() => {
        fetch('http://localhost:8080/aircraft')
            .then(res => res.json())
            .then(data => {
                setAircrafts(data);
            })
            .catch(error => console.error("Error fetching aircrafts:", error));
    }, []);

    function aircraftoptions() {
        return (
            <div>
                {planeData ? (
                    <div className="airplane-preview">
                        <div className="preview-ambulatory la">
                            <PreviewAmbulatory length={planeData.ambulatory_left} location="LA" />
                        </div>
                        <div className="preview-litter ll">
                            <PreviewLitter length={planeData.litter_left} location="LL" />
                        </div>
                        <div className="preview-litter rl">
                            <PreviewLitter length={planeData.litter_right} location="RL" />
                        </div>
                        <div className="preview-ambulatory ra">
                            <PreviewAmbulatory length={planeData.ambulatory_right} location="RA" />
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }

    return (
        <div className="aircraft-container">
            <div className="card">
                <div className="darkmode-container">
                    <DarkModeToggle />
                </div>

                <div className="form-button">
                <Button
                        label="Home"
                        onClick={() => navigate('/home')}
                        className="p-button-success"
                    />
                    <Button
                        label="Add Aircraft"
                        icon="pi pi-plus"
                        onClick={() => navigate('/AircraftCreate')}
                        className="p-button-success"
                    />
                </div>

                <div>
                    <h1 className="heading-list">Aircrafts</h1>
                    <ListBox
                        value={selectedAircraft}
                        options={aircrafts.map(aircraft => ({
                            label: (
                                <div>
                                    {`${aircraft.ac_name}`}
                                    <RadioButton
                                        value={aircraft.id}
                                        checked={selectedAircraft === aircraft.id}
                                        onChange={() => handleAircraftChange(aircraft.id)}
                                    />
                                </div>
                            ),
                            value: aircraft.id,
                        }))}
                        onChange={(e) => handleAircraftChange(e.value)}
                        className="listbox"
                    />
                </div>

                <div className="form-button">
                    <Button
                        label="Edit Aircraft"
                        icon="pi pi-pencil"
                        className="p-button-warning"
                        onClick={() => navigate(`/AircraftEdit/${selectedAircraft}`)}
                        disabled={selectedAircraft === null}
                    />
                    <Button
                        label="Delete Aircraft"
                        icon="pi pi-trash"
                        className="p-button-danger"
                        onClick={() => deleteAircraft(selectedAircraft)}
                        disabled={selectedAircraft === null}
                    />
                </div>
                {aircraftoptions()}
            </div>
        </div>
    );
}
