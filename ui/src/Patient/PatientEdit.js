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


export default function PatientEdit() {
    const navigate = useNavigate();
    const { patientid } = useParams();
    const [attendantInfo, setAttendantInfo] = useState([]);
    const [attendantAdjustInfo, setAttendantAdjustInfo] = useState([]);
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
      
      const handleAttendantInputChange = (index, e) => {
        const { name, value } = e.target; 
        const updatedAttendants = [...attendantInfo];
        updatedAttendants[index] = {
            ...updatedAttendants[index],
            [name]: value,
        };
        setAttendantInfo(updatedAttendants);
    };

    const handleAttendantAdjustInputChange = (index, e) => {
        const { name, value } = e.target; 
        const updatedAttendants = [...attendantAdjustInfo];
        updatedAttendants[index] = {
            ...updatedAttendants[index],
            [name]: value,
        };
        setAttendantAdjustInfo(updatedAttendants);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientInfo((prevInfo) => {
          const updatedInfo = { ...prevInfo, [name]: value };
      
          if (name === 'attendants') {
            const attC = parseInt(value, 10) || 0;
            const attendantsCount = attC - attendantAdjustInfo.length;
            const filteredAttendantInfo = attendantInfo.filter(attendant => attendant.passenger_weight !== null);
            let updatedAttendantInfo = filteredAttendantInfo.slice(0, attendantsCount);
            while (updatedAttendantInfo.length < attendantsCount) {
              updatedAttendantInfo.push({});
            }
            if (updatedAttendantInfo.length > attendantsCount) {
              updatedAttendantInfo = updatedAttendantInfo.slice(0, attendantsCount);
            }
            setAttendantInfo(updatedAttendantInfo);
          }
          return updatedInfo;
        });
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
            } else {
                console.error('Failed to update item');
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleAttendantAdjustmentSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`http://localhost:8080/attendant1`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(attendantAdjustInfo)
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

    const handleAttendantAdditionSubmit = async (e) => {
      e.preventDefault();
      if (attendantInfo.length === 0) {
        return null;
      }
      try{
        console.log(patientInfo.id)
        const response = await fetch(`http://localhost:8080/attendant1/${patientInfo.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            attendantInfo: attendantInfo})
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

    const handleAttendantDelete = async (attDeleted, e) => {
      e.preventDefault();
      try{
        const response = await fetch(`http://localhost:8080/attendant1/${attDeleted}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if(response.ok){
          const updatedAttendantAdjustInfo = attendantAdjustInfo.filter(attendant => attendant.id !== attDeleted);
          const updatedAttendantInfo = attendantInfo.filter(attendant => attendant.id !== attDeleted);

          setAttendantAdjustInfo(updatedAttendantAdjustInfo);
          setAttendantInfo(updatedAttendantInfo);

          if (updatedAttendantAdjustInfo.length === 0) {
              setAttendantAdjustInfo([]);
              setAttendantInfo([]);
          }
        } else{
          console.error('Failed to delete attendant.')
        }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

    const validateFields = () => {
      for (const key in patientInfo) {
          if (patientInfo[key] === '' || patientInfo[key] === null) {
              return false;
          }
      }
      for (const attendant of attendantInfo) {
          for (const key in attendant) {
              if (attendant[key] === '' || attendant[key] === null) {
                  return false;
              }
          }
      }
      for (const attendant of attendantAdjustInfo) {
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
    await handleSubmit(e);
    await handleAttendantAdjustmentSubmit(e);
    await handleAttendantAdditionSubmit(e);
    navigate('/PatientList');
    }

    useEffect(() => {
      fetch(`http://localhost:8080/attendantmission1/${patientid}`)
      .then(res => res.json())
      .then(data => setAttendantAdjustInfo(data))
    }, [patientid])

    const showAttendants = () => {
      console.log("current Attendants:", attendantAdjustInfo)
      if(attendantAdjustInfo.length === 0) {
        return null;
      } else {
          return attendantAdjustInfo.map((attendant, index) => (
              <Card key={index} title={`Attendant ${index + 1}`} style={{ marginTop: '10px', marginBottom: '20px' }}>
                    <form >
                        <div className="attendant-edit-list">
                            <FloatLabel>
                                <label htmlFor={`firstname-${index}`}>First Name</label>
                                <InputText name="first_name" placeholder="First Name" value={attendant.first_name} onChange={(e) => handleAttendantAdjustInputChange(index, e)} required  />
                            </FloatLabel>
                        </div>

                        <div className="attendant-edit-list">
                            <FloatLabel>
                                <label htmlFor={`lastname-${index}`}>Last Name</label>
                                <InputText name="last_name" placeholder="Last Name" value={attendant.last_name} onChange={(e) => handleAttendantAdjustInputChange(index, e)} required  />
                            </FloatLabel>
                        </div>

                        <div className="attendant-edit-list">
                            <FloatLabel>
                                <label htmlFor={`enplane-${index}`}>Enplane</label>
                                <InputText name="enplane" placeholder="Enplane" value={attendant.enplane} onChange={(e) => handleAttendantAdjustInputChange(index, e)} required />
                            </FloatLabel>
                        </div>

                        <div className="attendant-edit-list">
                            <FloatLabel>
                                <label htmlFor={`enplane-${index}`}>Deplane</label>
                                <InputText name="deplane" placeholder="Deplane" value={attendant.deplane} onChange={(e) => handleAttendantAdjustInputChange(index, e)} required />
                            </FloatLabel>
                        </div>

                        <div className="attendant-edit-list">
                            <FloatLabel>
                                <label htmlFor={`age-${index}`}>Age</label>
                                <InputNumber name="age" placeholder="Age" value={attendant.age} onValueChange={(e) => handleAttendantAdjustInputChange(index, e)} required />
                            </FloatLabel>
                        </div>

                        <div className="attendant-edit-list">
                            <FloatLabel>
                                <label htmlFor={`gender-${index}`}>Gender</label>
                                <InputText name="gender" value={attendant.gender} onChange={(e) => handleAttendantAdjustInputChange(index, e)} required />
                            </FloatLabel>
                        </div>

                        <div className="attendant-edit-list">
                            <FloatLabel>
                                <label htmlFor={`passenger-weight-${index}`}>Weight</label>
                                <InputNumber name="passenger_weight" value={attendant.passenger_weight} onValueChange={(e) => handleAttendantAdjustInputChange(index, e)} required  />
                            </FloatLabel>
                        </div>

                        <div className="attendant-edit-list">
                            <FloatLabel>
                                <label htmlFor={`grade-${index}`}>Grade</label>
                                <InputText name="grade" value={attendant.grade} onChange={(e) => handleAttendantAdjustInputChange(index, e)} required />
                            </FloatLabel>
                        </div>


                        <div className="attendant-edit-list">
                            <FloatLabel>
                                <label htmlFor={`attendant_specialty-${index}`}>Attendant Specialty</label>
                                <InputText name="attendant_specialty" value={attendant.attendant_specialty} onChange={(e) => handleAttendantAdjustInputChange(index, e)} required />
                            </FloatLabel>
                        </div>
                    </form>
                    <Button onClick={(e) => handleAttendantDelete(attendant.id, e)} disabled={patientInfo.attendants >= attendantAdjustInfo.length}>Delete</Button>
                </Card>
            )
          );
      }
    }

    function AddAttendants2() {
      console.log("Added Attendants:", attendantInfo)
      if(patientInfo.attendants < attendantAdjustInfo.length) {
        alert("Please Delete an attendant or change the patients attendants")
        return null
      } else if(patientInfo.attendants > attendantAdjustInfo.length) {
        let newAtt = (patientInfo.attendants - attendantAdjustInfo.length)
        const attendantCards = [];
        for(let i = 0; i < newAtt; i++) {
          attendantCards.push(
            <Card key={i} title={`Attendant ${i + attendantAdjustInfo.length + 1}`} className="attendant-title">
                  <form>
                      <div className="attendant-edit-list">
                          <FloatLabel>
                              <label htmlFor={`firstname-${i}`}>First Name</label>
                              <InputText name="first_name" placeholder="First Name" value={attendantInfo[i]?.first_name || ''} onChange={(e) => handleAttendantInputChange(i, e)} required  />
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
          );
      }
      return <>{attendantCards}</>;
    }
  } 
    

    return (
      <div className="container">
          <Card title={`${patientInfo.first_name} ${patientInfo.last_name}'s Info`} className="card">
          <div className="darkmode-container">
            <DarkModeToggle />
          </div>
              
              <form className="form-grid" onSubmit={handleAllSubmit}>

                <div className="edit-list">
                <FloatLabel>
                  <label>First Name</label>
                  <InputText name="first_name" value={patientInfo.first_name} onChange={handleInputChange} required />
                </FloatLabel>
                </div>

                <div className="edit-list">
                <FloatLabel>
                  <label>Last Name</label>
                  <InputText name="last_name" value={patientInfo.last_name} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                <FloatLabel>
                  <label>Patient ID</label>
                  <InputNumber name="patient_id" value={patientInfo.patient_id} onValueChange={handleInputChange} required useGrouping={false} />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>Casualty Event</label>
                  <InputText name="casualty_event" value={patientInfo.casualty_event} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>
                
                <div className="edit-list">
                  <FloatLabel>
                  <label>Requirements</label>
                  <InputText name="requirements" value={patientInfo.requirements} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>Attendants</label>
                  <InputNumber name="attendants" value={patientInfo.attendants} onValueChange={handleInputChange} min={0} max={15} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>Originating MTF</label>
                  <InputText name="originating_mtf" value={patientInfo.originating_mtf} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>Destination MTF</label>
                  <InputText name="destination_mtf" value={patientInfo.destination_mtf} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>
  
                <div className="edit-list">
                  <FloatLabel>
                  <label>Primary Med Spec</label>
                  <InputText name="primary_med_spec" value={patientInfo.primary_med_spec} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>Primary Diagnosis</label>
                  <InputText name="primary_diagnosis" value={patientInfo.primary_diagnosis} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>
  
                <div className="edit-list">
                  <FloatLabel>
                  <label>Secondary Diagnosis</label>
                  <InputText name="secondary_diagnosis" value={patientInfo.secondary_diagnosis} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>Other Diagnosis</label>
                  <InputText name="other_diagnosis" value={patientInfo.other_diagnosis} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>E/PS </label>
                  <InputText name="eps" value={patientInfo.eps} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>D/DS</label>
                  <InputText name="dds" value={patientInfo.dds} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>UPR </label>
                  <InputText name="upr" value={patientInfo.upr} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>Passenger Age</label>
                  <InputNumber name="age" value={patientInfo.age} onValueChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>Gender</label>
                  <InputText name="gender" value={patientInfo.gender} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>Weight</label>
                  <InputNumber name="passenger_weight" value={patientInfo.passenger_weight} onValueChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>Grade</label>
                  <InputText name="grade" value={patientInfo.grade} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>
                
                <div className="edit-list">
                  <FloatLabel>
                  <label>Equipment</label>
                  <InputText name="equipment" value={patientInfo.equipment} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>Diet Restrictions</label>
                  <InputText name="diet" value={patientInfo.diet} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>

                <div className="edit-list">
                  <FloatLabel>
                  <label>Altitude Restriction</label>
                  <InputText name="max_alt" value={patientInfo.max_alt} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>
  
                <div className="edit-list">
                  <FloatLabel>
                  <label>Spec</label>
                  <InputText name="spec" value={patientInfo.spec} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>
  
                <div className="edit-list">
                  <FloatLabel>
                  <label>Specialty Team</label>
                  <InputText name="special_team" value={patientInfo.special_team} onChange={handleInputChange} required />
                  </FloatLabel>
                </div>
  
                  <div className="form-button">
                      <Button label="Commit Changes" icon="pi pi-check" type="submit" className="p-button-success"/>
                  </div>
                  {showAttendants()}
                  {AddAttendants2()}
              </form>
          </Card>
          
      </div>
  );
}