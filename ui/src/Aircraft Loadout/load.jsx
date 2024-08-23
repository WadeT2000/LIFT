import React, { useState, useEffect, useReducer } from 'react';
import { renderRows, PersonList} from './builder.jsx';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
// import './patientTable.css';
import './load.css';


import StopsInOrder from './Stops';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useAutoAssign from './autoAssign';
import DarkModeToggle from '../DarkMode/DarkModeToggle';
import { Button } from 'primereact/button';

function Load() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const location = useLocation();
  const [sortedStops, setSortedStops] = useState([]);
  const plane = location.state?.selectedPlane 
  const [occupiedSeats, setOccupiedSeats] = useState({});
  const [attendants, setAttendants] = useState([])
  const { autoAssignPatients, loading } = useAutoAssign();
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [loadPlanInfo, setLoadPlanInfo] = useState({ lp_name: ''});


  useEffect(() => {
    fetch('http://localhost:8080/patientsmission1')
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.error('Error fetching patients:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/loadattendants')
      .then(response => response.json())
      .then(data => setAttendants(data))
      .catch(error => console.error('Error fetching attendants:', error));
  }, []);

  const handleUpdateStops = (stops) => {
    const reversedStops = [...stops].reverse();
    setSortedStops(stops); 
    const sortedPatients = [...patients].sort((a, b) => {
      const indexA = reversedStops.indexOf(a.dds);
      const indexB = reversedStops.indexOf(b.dds);
      return indexA - indexB;
    });
    const sortedAttendants = [...attendants].sort((a, b) => {
      const patientA = sortedPatients.find(patient => patient.id === a.patient_id);
      const patientB = sortedPatients.find(patient => patient.id === b.patient_id);
      return sortedPatients.indexOf(patientA) - sortedPatients.indexOf(patientB);
    });
    setPatients(sortedPatients); 
    setAttendants(sortedAttendants);
  };

  useEffect(() => {
    if (sortedStops.length > 0) {
      handleUpdateStops(sortedStops);
    }
  }, [sortedStops]);


  const movePatient = (patientId, toSlot) => {
    setOccupiedSeats(prev => {
      const newOccupiedSeats = { ...prev };
      // Remove patient from previous slot
      Object.keys(newOccupiedSeats).forEach(slot => {
        if (newOccupiedSeats[slot] === patientId) {
          delete newOccupiedSeats[slot];
        }
      });
      // Add patient to new slot
      if (toSlot) {
        newOccupiedSeats[toSlot] = patientId;
      }
      return newOccupiedSeats;
    });
  };

  const moveAttendant = (attendantId, toSlot) => {
    setOccupiedSeats(prev => {
      const newOccupiedSeats = { ...prev };
      // Remove attendant from previous slot
      Object.keys(newOccupiedSeats).forEach(slot => {
        if (newOccupiedSeats[slot] === attendantId) {
          delete newOccupiedSeats[slot];
        }
      });
      // Add attendant to new slot
      if (toSlot) {
        newOccupiedSeats[toSlot] = attendantId;
      }
      return newOccupiedSeats;
    });
  };

  const handleAutoAssign = () => {
    const result = autoAssignPatients();
    if (result) {
      setOccupiedSeats(result.newOccupiedSeats);
    }
  };




  const handlesaveLP = async (e) => {
    e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/lpsave`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  loadPlanInfo: loadPlanInfo, 
                  occupiedSeats: occupiedSeats,
                  sortedStops: sortedStops,
                  plane: plane
                })
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
            } else {
                console.error('Failed to update LoadPlan');
            }
        } catch (error) {
            console.error('Error updating LoadPlan:', error);
        }
    };

const validateFields = () => {
  for (const key in loadPlanInfo) {
      if (loadPlanInfo[key] === '' || loadPlanInfo[key] === null) {
          return false;
      }
  }
  return true;
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setLoadPlanInfo({ ...loadPlanInfo, [name]: value });
};

const handleAllSubmit = async (e) => {
  e.preventDefault();
  if (!validateFields()) {
      alert('Please fill in all the fields before submitting.');
      return;
  }
  await handlesaveLP(e);
  navigate('/home');
};

const handleAutoClear = () => {
  setOccupiedSeats([])
}






  return (
    <div className="load-container">
      <div className='topboxesload'>
        <div className="stops">
          <button className="auto-assign-btn" onClick={handleAutoAssign}>Auto Assign</button>
          <button className='auto-assign-btn' onClick={handleAutoClear}>Clear</button>
          <StopsInOrder onUpdateStops={handleUpdateStops} />
        </div>
        <Card title={`Save Your Load Plan`} className="load-card">
              <form className="form-grid1" onSubmit={handleAllSubmit}>
                <div className="edit-list">
                  <FloatLabel>
                    <label>Load Plan Name</label>
                    <InputText name="lp_name" value={loadPlanInfo.lp_name} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>
                <div className="form-button">
                    <Button label="Save" icon="pi pi-check" type="submit" className="p-button-success meow-button" />
                </div>
              </form>
        </Card>
      </div>
      <div className="main-content">
        <div className="airplane-section">
          {renderRows(plane, patients, attendants, occupiedSeats, movePatient, moveAttendant)}
        </div>
        <div className="person-list">
          <PersonList
            people={patients.filter(p => !Object.values(occupiedSeats).includes(p.patient_id))}
            movePatient={movePatient}
            isAttendantList={false}
          />
        </div>
        <div className="person-list">
          <PersonList
            people={attendants.filter(a => !Object.values(occupiedSeats).includes(a.id))}
            moveAttendant={moveAttendant}
            isAttendantList={true}
          />
        </div>

      </div>
            <div className="darkmode-container">
                    <DarkModeToggle />
                </div>
    </div>
  );
}


export default Load;