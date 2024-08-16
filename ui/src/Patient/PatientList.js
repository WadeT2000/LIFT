// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from 'primereact/button';
// import { ListBox } from 'primereact/listbox';
// import { RadioButton } from 'primereact/radiobutton';
// import { Toast } from 'primereact/toast';
// import { FileUpload } from 'primereact/fileupload';
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';



// export default function PatientList() {
//   const navigate = useNavigate();
//   const [patients, setPatients] = useState([]);
//   const [attendantPresent, setAttendantPresent] = useState([]);
//   const [attendants, setAttendants] = useState([]);
//   const [selectedPatient, setSelectedPatient] = useState(null);


//   async function deletepatient(selectedPatient) {
//     try {
//         await fetch(`http://localhost:8080/attendantmission1/${selectedPatient}`)
//             .then(res => res.json())
//             .then(data => setAttendantPresent(data));

//         if (attendantPresent.length > 0) {
//             const aresponse = await fetch(`http://localhost:8080/attendantmission1/${selectedPatient}`, {
//                 method: 'DELETE',
//                 credentials: 'include'
//             });
//             if (!aresponse.ok) {
//                 console.error("Failed to delete attendant");
//             }
//         }

//         const presponse = await fetch(`http://localhost:8080/patientmission1/${selectedPatient}`, {
//             method: 'DELETE',
//             credentials: 'include'
//         });
//         if (presponse.ok) {
//             setPatients(patients.filter(patient => patient.id !== selectedPatient));
//             setAttendants(attendants.filter(attendant => attendant.patient_id !== selectedPatient));
//             setSelectedPatient(null);
//         } else {
//             console.error("Failed to delete item");
//         }
//     } catch (error) {
//         console.error("Error deleting item:", error);
//     }
// }

//   useEffect(() => {
//     fetch('http://localhost:8080/patientsmission1').then(res => res.json()).then(data => setPatients(data));
//     fetch('http://localhost:8080/attendantsmission1').then(res => res.json()).then(data => setAttendants(data));
//   }, [])

  



// //=================== File Upload Code==============================
//   const toast = useRef(null);

//     const onUpload = () => {
//         toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
//     };
// //=================== File Upload Code==============================

// return (
//   <div className="container" style={{ padding: '20px', textAlign: 'center' }}>
//     <div>
//       <Toast ref={toast}></Toast>
//       <FileUpload 
//         mode="basic" 
//         name="demo[]"
//         url="/api/upload" 
//         accept="image/*" 
//         maxFileSize={1000000} 
//         onUpload={onUpload} 
//         auto 
//         chooseLabel="Add New Mission"
//       />
//     </div>  

//     <Button label="Add Single Patient"  icon="pi pi-plus"  onClick={() => navigate('/PatientAddPage')} className="p-button-success"/>
    
//     <div className='patient-list'>
//       <ListBox 
//         value={selectedPatient} 
//         options={patients.map((patient) => ({
//           label: (
//             <div className='patient-list'>
//               {`${patient.first_name} ${patient.last_name} - ${patient.patient_id}`}
//               <RadioButton 
//                 value={patient.id}  
//                 checked={selectedPatient === patient.id} 
//               />
//             </div>
//           ),
//           value: patient.id,
//         }))}
//         onChange={(e) => setSelectedPatient(e.value)}
//         style={{ width: '100%' }}
//       />
//       <div>
//         <Button 
//           label="Edit Patient" 
//           icon="pi pi-pencil" 
//           className="p-button-warning" 
//           onClick={() => navigate(`/PatientEdit/${selectedPatient}`)}
//           disabled={selectedPatient === null}
//         />
//         <Button 
//           label="Delete Patient" 
//           icon="pi pi-trash" 
//           className="p-button-danger" 
//           onClick={() => deletepatient(selectedPatient)}
//           disabled={selectedPatient === null}
//         />
//         <Button 
//           label="Back" 
//           icon="pi pi-arrow-left" 
//           onClick={() => navigate('/home')} 
//           className="p-button-secondary" 
//         />
//       </div>
//     </div>
//     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//         {attendants.map(attendant => (
//           <div>
//           <p key={attendant.first_name}>
//             {`${attendant.first_name} ${attendant.last_name} - ${attendant.patient_id}`}
//           </p>
//           </div>
//         ))}
//       </div>
    
//   </div>
// );
// }

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './PatientEdit.css';

export default function PatientList() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [attendantPresent, setAttendantPresent] = useState([]);
    const [attendants, setAttendants] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    async function deletepatient(selectedPatient) {
        try {
            await fetch(`http://localhost:8080/attendantmission1/${selectedPatient}`)
                .then(res => res.json())
                .then(data => setAttendantPresent(data));

            if (attendantPresent.length > 0) {
                const aresponse = await fetch(`http://localhost:8080/attendantmission1/${selectedPatient}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (!aresponse.ok) {
                    console.error("Failed to delete attendant");
                }
            }

            const presponse = await fetch(`http://localhost:8080/patientmission1/${selectedPatient}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (presponse.ok) {
                setPatients(patients.filter(patient => patient.id !== selectedPatient));
                setAttendants(attendants.filter(attendant => attendant.patient_id !== selectedPatient));
                setSelectedPatient(null);
            } else {
                console.error("Failed to delete item");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }

    useEffect(() => {
        fetch('http://localhost:8080/patientsmission1').then(res => res.json()).then(data => setPatients(data));
        fetch('http://localhost:8080/attendantsmission1').then(res => res.json()).then(data => setAttendants(data));
    }, []);

    // File Upload functionality
    const toast = useRef(null);

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    return (
        <div className="container">
            <div className="card">
                <Toast ref={toast} />

                <div className="form-button">
                    <FileUpload
                        mode="basic"
                        name="demo[]"
                        url="/api/upload"
                        accept="image/*"
                        maxFileSize={1000000}
                        onUpload={onUpload}
                        auto
                        chooseLabel="Add New Mission"
                    />
                </div>

                <div className="form-button">
                    <Button
                        label="Add Single Patient"
                        icon="pi pi-plus"
                        onClick={() => navigate('/PatientAddPage')}
                        className="p-button-success"
                    />
                </div>

                <div>
                    <h1 className="heading-list">Patients</h1>
                    <ListBox
                        value={selectedPatient}
                        options={patients.map(patient => ({
                            label: (
                                <div>
                                    {`${patient.first_name} ${patient.last_name} - ${patient.patient_id}`}
                                    <RadioButton
                                        className="radiobutton"
                                        value={patient.id}
                                        checked={selectedPatient === patient.id}
                                    />
                                </div>
                            ),
                            value: patient.id,
                        }))}
                        onChange={(e) => setSelectedPatient(e.value)}
                        className="listbox"
                    />
                </div>

                <div className="form-button">
                    <Button
                        label="Edit Patient"
                        icon="pi pi-pencil"
                        className="p-button-warning"
                        onClick={() => navigate(`/PatientEdit/${selectedPatient}`)}
                        disabled={selectedPatient === null}
                    />
                    <Button
                        label="Delete Patient"
                        icon="pi pi-trash"
                        className="p-button-danger"
                        onClick={() => deletepatient(selectedPatient)}
                        disabled={selectedPatient === null}
                    />
                    <Button
                        label="Back"
                        icon="pi pi-arrow-left"
                        onClick={() => navigate('/home')}
                        className="p-button-secondary"
                    />
                </div>

                <div >
                    <h1 className="heading-list">Attendants</h1>
                    {attendants.map(attendant => (
                        <div key={attendant.first_name}>
                            <p className="heading-list">
                                {`${attendant.first_name} ${attendant.last_name} - ${attendant.patient_id}`}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
