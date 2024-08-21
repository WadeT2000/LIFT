
import React, { useState, useEffect } from 'react';

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
                //  const patientId = patient.patient_id || patient.id;
                // newOccupiedSeats[assignedSeat.id] = patient.id;
                // assignedPatients.add(patient.id);
                // return assignedSeat;
                const patientId = patient.patient_id || patient.id;
            newOccupiedSeats[assignedSeat.id] = patientId;
            assignedPatients.add(patientId);
            console.log(`Assigned patient ${patientId} to seat ${assignedSeat.id}`);
            return assignedSeat;

            }
            return null;
        };

        const assignAttendants = (patient, patientSeat) => {
        //      const patientId = patient.patient_id || patient.id;
        // const patientAttendants = attendants.filter(a => a.patient_id === patient.id);
        // patientAttendants.forEach(attendant => {
        //     const nearestSeat = findNearestAmbulatorySeat(patientSeat, allAmbulatorySeats);
        //     if (nearestSeat) {
        //         const index = allAmbulatorySeats.findIndex(s => s.id === nearestSeat.id);
        //         if (index > -1) {
        //             allAmbulatorySeats.splice(index, 1);
            //             newOccupiedSeats[nearestSeat.id] = `attendant_${attendant.id}`
            //             assignedAttendants.add(attendant.id);
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

    console.log("Assigned Patients:", assignedPatients);
    console.log("Assigned Attendants:", assignedAttendants);
    console.log("New Occupied Seats:", newOccupiedSeats);


    //     const assignPatientAndAttendant = (patient, seatPool1, seatPool2) => {
    //         if (seatPool1.length > 0) {
    //             const seat = seatPool1.shift();
    //             newOccupiedSeats[seat.id] = patient.id;
    //             assignedPatients.add(patient.id);
    //             const patientAttendants = attendants.filter(a => a.patient_id === patient.id )//|| patient.patient_id)// || a.patient_id === patient.patient_id); //IF patient.patient_id THEN does patients; IF patient.id THEN does attendants
    //             patientAttendants.forEach(attendant => {
    //                  const nearestSeat = findNearestAmbulatorySeat(seat, allAmbulatorySeats);
    //                 if (nearestSeat) {
    //                     const index = allAmbulatorySeats.findIndex(s => s.id === nearestSeat.id);
    //                     if (index > -1) allAmbulatorySeats.splice(index, 1);
    //                     newOccupiedSeats[nearestSeat.id] = `attendant_${attendant.id}`;
    //                     assignedAttendants.add(attendant.id);
    //                 }
    //             });

    //         } else if (seatPool2.length > 0) {
    //             const seat = seatPool2.shift();
    //             newOccupiedSeats[seat.id] = patient.id;
                                    
    //             const patientAttendants = attendants.filter(a => a.patient_id === patient.id )//|| patient.patient_id)// || a.patient_id === patient.patient_id);//a
    //             patientAttendants.forEach(attendant => {
    //                const nearestSeat = findNearestAmbulatorySeat(seat, allAmbulatorySeats);
    //                 if (nearestSeat) {
    //                     const index = allAmbulatorySeats.findIndex(s => s.id === nearestSeat.id);
    //                     if (index > -1) allAmbulatorySeats.splice(index, 1);
    //                     newOccupiedSeats[nearestSeat.id] = `attendant_${attendant.id}`;
    //                     assignedAttendants.add(attendant.id);
    //                 }
    //             });
    //         };
    //     }
    //        // Assign litter patients
    // litterPatients.forEach((patient, index) => {
    //     if (index % 2 === 0) {
    //         assignPatientAndAttendant(patient, leftLitterSeats, rightLitterSeats);
    //     } else {
    //         assignPatientAndAttendant(patient, rightLitterSeats, leftLitterSeats);
    //     }
    // });

    // // Assign ambulatory patients
    // ambulatoryPatients.forEach((patient, index) => {
    //     if (index % 2 === 0) {
    //         assignPatientAndAttendant(patient, leftAmbulatorySeats, rightAmbulatorySeats);
    //     } else {
    //         assignPatientAndAttendant(patient, rightAmbulatorySeats, leftAmbulatorySeats);
    //     }
    // });

        return { newOccupiedSeats,
            assignedPatients: Array.from(assignedPatients),
            assignedAttendants: Array.from(assignedAttendants)
         }
    };

    return { autoAssignPatients, loading, error };
};

export default useAutoAssign;