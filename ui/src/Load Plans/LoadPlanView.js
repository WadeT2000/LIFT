import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import React, { useReducer } from 'react';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import '../Aircraft Loadout/patientTable.css';
import '../Aircraft Loadout/load.css';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../DarkMode/DarkModeToggle';
import { Button } from 'primereact/button';
import { useDrag, useDrop } from 'react-dnd';
import '../Aircraft Loadout/builder.css';
import '../Aircraft Loadout/Stops.css';



/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
////////////////////////////Auto Assign//////////////////////////////

const useAutoAssign = () => {
    const [patients, setPatients] = useState([]);
    const [uprOrder, setUprOrder] = useState({});
    const [aircraft, setAircraft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attendants, setAttendants] = useState([]);


    const litterRequirements = ['1A', '1B', '2A', '2B', '4D', '5D', '5E'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patientsResponse = await fetch('http://localhost:8080/patientsmission1');
                if (!patientsResponse.ok) {
                    throw new Error(`HTTP error! status: ${patientsResponse.status}`);
                }
                const patientsData = await patientsResponse.json();
                setPatients(patientsData);

                const uniqueUPRs = [...new Set(patientsData.map(patient => patient.upr))];
                const order = {};
                ['Priority', 'Urgent', 'Routine'].forEach((upr, index) => {
                    if (uniqueUPRs.includes(upr)) {
                        order[upr] = index;
                    }
                });
                uniqueUPRs.forEach(upr => {
                    if (!(upr in order)) {
                        order[upr] = Object.keys(order).length;
                    }
                });
                setUprOrder(order);

                const attendantsResponse = await fetch('http://localhost:8080/loadattendants');
                const attendantsData = await attendantsResponse.json();
                setAttendants(attendantsData);

                const aircraftResponse = await fetch('http://localhost:8080/aircraft');
                if (!aircraftResponse.ok) {
                    throw new Error(`HTTP error! status: ${aircraftResponse.status}`);
                }
                const aircraftData = await aircraftResponse.json();
                setAircraft(aircraftData[0]);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const generateSeats = (aircraft) => {
        const seats = [];
        // Left Ambulatory
        for (let i = 0; i < aircraft.ambulatory_left; i++) {
            seats.push({ id: `LA ${i}`, type: 'ambulatory', location: 'LA' });
        }
        // Left Litter
        for (let i = 0; i < aircraft.litter_left; i++) {
            seats.push({ id: `LL ${i}`, type: 'litter', location: 'LL' });
        }
        // Right Litter
        for (let i = 0; i < aircraft.litter_right; i++) {
            seats.push({ id: `RL ${i}`, type: 'litter', location: 'RL' });
        }
        // Right Ambulatory
        for (let i = 0; i < aircraft.ambulatory_right; i++) {
            seats.push({ id: `RA ${i}`, type: 'ambulatory', location: 'RA' });
        }
        return seats;
    };

    const findNearestAmbulatorySeat = (patientSeat, ambulatorySeats) => {
        return ambulatorySeats.reduce((nearest, seat) => {
            const currentDistance = Math.abs(parseInt(seat.id.match(/\d+/)[0]) - parseInt(patientSeat.id.match(/\d+/)[0]));
            const nearestDistance = nearest ? Math.abs(parseInt(nearest.id.match(/\d+/)[0]) - parseInt(patientSeat.id.match(/\d+/)[0])) : Infinity;
            return currentDistance < nearestDistance ? seat: nearest;
        }, null);
    }

    const autoAssignPatients = () => {
        if (loading || !aircraft) {
            console.log("Still loading or aircraft data not available");
            return null;
        }

        const seats = generateSeats(aircraft);

    const leftLitterSeats = seats.filter(seat => seat.type === 'litter' && seat.location === 'LL');
    const rightLitterSeats = seats.filter(seat => seat.type === 'litter' && seat.location === 'RL');
    const leftAmbulatorySeats = seats.filter(seat => seat.type === 'ambulatory' && seat.location === 'LA');
    const rightAmbulatorySeats = seats.filter(seat => seat.type === 'ambulatory' && seat.location === 'RA');
    const allAmbulatorySeats = [...leftAmbulatorySeats, ...rightAmbulatorySeats];


        const sortedPatients = [...patients].sort((a, b) => {
            if (uprOrder[a.upr] !== uprOrder[b.upr]) {
                return uprOrder[a.upr] - uprOrder[b.upr];
            }
            return patients.indexOf(a) - patients.indexOf(b);
        });


        const newOccupiedSeats = {};
        const assignedPatients = new Set();
        const assignedAttendants = new Set();

        const assignPatient = (patient, seatPool1, seatPool2) => {
            let assignedSeat;
            if (seatPool1.length > 0) {
                assignedSeat = seatPool1.shift();
            } else if (seatPool2.length > 0) {
                assignedSeat = seatPool2.shift();
            }

            if (assignedSeat) {
                const patientId = patient.patient_id || patient.id;
            newOccupiedSeats[assignedSeat.id] = patientId;
            assignedPatients.add(patientId);
            console.log(`Assigned patient ${patientId} to seat ${assignedSeat.id}`);
            return assignedSeat;

            }
            return null;
        };

        const assignAttendants = (patient, patientSeat) => {
            const patientId = patient.patient_id || patient.id;
        const patientAttendants = attendants.filter(a => String(a.patient_id) === String(patientId));
        patientAttendants.forEach(attendant => {
            const nearestSeat = findNearestAmbulatorySeat(patientSeat, allAmbulatorySeats);
            if (nearestSeat) {
                const index = allAmbulatorySeats.findIndex(s => s.id === nearestSeat.id);
                if (index > -1) {
                    allAmbulatorySeats.splice(index, 1);
                    newOccupiedSeats[nearestSeat.id] = `attendant_${attendant.id}`;
                    assignedAttendants.add(attendant.id);
                    console.log(`Assigned attendant ${attendant.id} to seat ${nearestSeat.id} for patient ${patientId}`);
                }
            }
        });
    };



        const litterPatients = sortedPatients.filter(patient => litterRequirements.includes(patient.requirements));
        const ambulatoryPatients = sortedPatients.filter(patient => !litterRequirements.includes(patient.requirements));
    

        // Assign litter patients
    litterPatients.forEach((patient, index) => {
        const assignedSeat = index % 2 === 0
            ? assignPatient(patient, leftLitterSeats, rightLitterSeats)
            : assignPatient(patient, rightLitterSeats, leftLitterSeats);
        
        if (assignedSeat) {
            assignAttendants(patient, assignedSeat);
        }
    });

    // Assign ambulatory patients
    ambulatoryPatients.forEach((patient, index) => {
        const assignedSeat = index % 2 === 0
            ? assignPatient(patient, leftAmbulatorySeats, rightAmbulatorySeats)
            : assignPatient(patient, rightAmbulatorySeats, leftAmbulatorySeats);
        
        if (assignedSeat) {
            assignAttendants(patient, assignedSeat);
        }
    });

        return { newOccupiedSeats,
            assignedPatients: Array.from(assignedPatients),
            assignedAttendants: Array.from(assignedAttendants)
         }
    };

    return { autoAssignPatients, loading, error };
}



/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////View Load Plan//////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

export default function ViewLoadPlan() {
    const {lpId} = useParams();
    const [occupiedSeats, setOccupiedSeats] = useState({});
    const [sortedStops, setSortedStops] = useState([])
    const [loadPlanInfo, setLoadPlanInfo] = useState({});
    const [plane, setPlane] = useState({})
    const [loadPlan, setLoadPlan] = useState({})


    useEffect(()=>{
        fetch(`http://localhost:8080/loadplans?search=${lpId}`).then(res => res.json()).then(data => {
            setLoadPlan(data)
            setOccupiedSeats(data[0].occupied_seats)
            setSortedStops(data[0].stops_order)
            setLoadPlanInfo({lp_name: data[0].lp_name})
            setPlane(data[0].plane)
        })
    }, [])

    const handleAutoClear = () => {
        setOccupiedSeats([])
      }

  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [attendants, setAttendants] = useState([])
  const { autoAssignPatients, loading } = useAutoAssign();
  const [, forceUpdate] = useReducer(x => x + 1, 0);


  useEffect(() => {
    fetch('http://localhost:8080/patientsmission1')
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.error('Error fetching patients:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/loadattendants')
      .then(response => response.json())
      .then(data => {
        setAttendants(data)
      })
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
            const response = await fetch(`http://localhost:8080/lpupdate/${loadPlan[0].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
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



/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////////Builder////////////////////////////////



function renderRows(planeData, patients, attendants, occupiedSeats, movePatient, moveAttendant) {
  return (
    <div className="airplane-container">
      <div className="airplane-body">
        <div className="airplane-section left-section">
          <div className="ambulatory-seats">
            <Ambulatory length={planeData.ambulatory_left}
              location="LA"
              patients={patients}
              attendants={attendants}
              occupiedSeats={occupiedSeats}
              movePatient={movePatient}
              moveAttendant={moveAttendant}
            />
          </div>
        </div>
        <div className="airplane-section center-section">
          <div className="litter-beds-container">
            <div className="litter-beds">
              <Litter length={planeData.litter_left}
                location="LL"
                patients={patients}
                attendants={attendants}
                occupiedSeats={occupiedSeats}
                movePatient={movePatient}
                moveAttendant={moveAttendant}
              />
            </div>
            <div className="litter-beds">
              <Litter length={planeData.litter_right}
                location="RL"
                patients={patients}
                attendants={attendants}
                occupiedSeats={occupiedSeats}
                movePatient={movePatient}
                moveAttendant={moveAttendant}
              />
            </div>
          </div>
        </div>
        <div className="airplane-section right-section">
          <div className="ambulatory-seats">
            <Ambulatory length={planeData.ambulatory_right}
              location="RA"
              patients={patients}
              attendants={attendants}
              occupiedSeats={occupiedSeats}
              movePatient={movePatient}
              moveAttendant={moveAttendant}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Ambulatory({ length, location, patients, attendants, occupiedSeats, movePatient, moveAttendant }) {
  return (
    <div className={`Ambulatory ${location}`}>
      {[...Array(length)].map((_, index) => (
        <AmbulatorySlot
          key={index}
          slotId={`${location} ${index}`}
          patients={patients}
          attendants={attendants}
          occupiedSeats={occupiedSeats}
          movePatient={movePatient}
          moveAttendant={moveAttendant}
        />
      ))}
    </div>
  );
}

function Litter({ length, location, patients, attendants, occupiedSeats, movePatient, moveAttendant }) {
  return (
    <div className={`Litter ${location}`}>
      {[...Array(length)].map((_, index) => (
        <LitterSlot
          key={index}
          slotId={`${location} ${index}`}
          patients={patients}
          attendants={attendants}
          occupiedSeats={occupiedSeats}
          movePatient={movePatient}
          moveAttendant={moveAttendant}
        />
      ))}
    </div>
  );
}

function AmbulatorySlot({ slotId, patients, attendants, occupiedSeats, movePatient, moveAttendant }) {
  const occupantId = occupiedSeats[slotId];
  const occupant = patients.find(p => p.patient_id === occupantId) || attendants.find(a => a.id === occupantId);

  const [{ isDragging }, drag] = useDrag({
    type: 'PERSON',
    item: () => occupant ? { ...occupant, fromSlot: slotId } : null,
    canDrag: () => !!occupant,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && !dropResult) {
        if (patients.find(p => p.patient_id === item.patient_id)) {
          movePatient(item.patient_id, null);
        } else {
          moveAttendant(item.id, null);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'PERSON',
    drop: (item) => {
      if (patients.find(p => p.patient_id === item.patient_id)) {
        movePatient(item.patient_id, slotId);
      } else {
        moveAttendant(item.id, slotId);
      }
      return { slotId };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });


  return (
    <div
      ref={node => drag(drop(node))}
      className="AmbulatorySlot"
      style={{
        backgroundColor: isOver ? 'lightgreen' : 'white',
        opacity: isDragging ? 0.5 : 1
      }}
    >
      {occupant ? `${slotId} ${occupant.first_name} ${occupant.last_name}` : slotId}
    </div>
  );
}

function LitterSlot({ slotId, patients, attendants, occupiedSeats, movePatient, moveAttendant }) {
  const occupantId = occupiedSeats[slotId];
  const occupant = patients.find(p => p.patient_id === occupantId) || attendants.find(a => a.id === occupantId);

  const [{ isDragging }, drag] = useDrag({
    type: 'PERSON',
    item: () => occupant ? { ...occupant, fromSlot: slotId } : null,
    canDrag: () => !!occupant,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && !dropResult) {
        if (patients.find(p => p.patient_id === item.patient_id)) {
          movePatient(item.patient_id, null);
        } else {
          moveAttendant(item.id, null);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'PERSON',
    drop: (item) => {
      if (patients.find(p => p.patient_id === item.patient_id)) {
        movePatient(item.patient_id, slotId);
      } else {
        moveAttendant(item.id, slotId);
      }
      return { slotId };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={node => drag(drop(node))}
      className="LitterSlot"
      style={{
        backgroundColor: isOver ? 'lightgreen' : 'white',
        opacity: isDragging ? 0.5 : 1
      }}
    >
      {occupant ? `${slotId} ${occupant.first_name} ${occupant.last_name}` : slotId}
    </div>
  );
}

function PersonList({ people, movePatient, moveAttendant, isAttendantList }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'PERSON',
    drop: (item) => {

      if (isAttendantList) {
        moveAttendant(item.id, null);
      } else {
        movePatient(item.patient_id, null);
      }
      return { name: isAttendantList ? 'AttendantList' : 'PatientList' };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <>
      <div ref={drop} className="patient-list-container" >
        <h2 className="patient-list-title">{isAttendantList ? "Attendant List" : "Patient List"}</h2>
        <div className="table-container">
          <table className="patient-table">
            <thead>
              <tr>
                <th>{isAttendantList ? "Attendant" : "Patient"}</th>
                <th>{isAttendantList ? "Watching" : "DDS"}</th>
                <th>{isAttendantList ? null : "Requirements"}</th>
                <th>{isAttendantList ? null : "Attendants"}</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={isAttendantList ? person.id : person.patient_id}>
                  <td>
                    <DraggablePerson
                      person={person}
                      movePatient={movePatient}
                      moveAttendant={moveAttendant}
                      isAttendant={isAttendantList}
                    />
                  </td>
                  <td>{isAttendantList ? `${person.patient_fn} ${person.patient_ln}` : person.dds}</td>
                  <td>{isAttendantList ? null : person.requirements}</td>
                  <td>{isAttendantList ? null : person.attendants == 0 ? null : person.attendants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
function DraggablePerson({ person, movePatient, moveAttendant, isAttendant }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'PERSON',
    item: { ...person },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        if (isAttendant) {
          moveAttendant(item.id, dropResult.slotId);
        } else {
          movePatient(item.patient_id, dropResult.slotId);
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {`${person.first_name} ${person.last_name}`}
    </div>
  );
}






/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////////Stops/////////////////////////////////



const StopsInOrder = ({ onUpdateStops }) => {
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData('text/plain'));
    const newStops = [...sortedStops];
    const [reorderedItem] = newStops.splice(dragIndex, 1);
    newStops.splice(dropIndex, 0, reorderedItem);
    setSortedStops(newStops);
    onUpdateStops(newStops);
  };

  return (
    <div className="stops-list">
      <h2>Stops in Order</h2>
      {sortedStops.length > 0 ? (
        <ul>
          {sortedStops.map((stop, index) => (
            <div
              key={stop}
              className="stop-item"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <span className="stop-number">{index + 1}</span>
              <span className="stop-code">{stop}</span>
            </div>
          ))}
        </ul>
      ) : (
        <p>No stops found.</p>
      )}
    </div>
  );
};











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