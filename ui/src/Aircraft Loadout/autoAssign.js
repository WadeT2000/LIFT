
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

                const attendantsResponse = await fetch('http://localhost:8080/attendantsmission1');
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


        const sortedPatients = [...patients].sort((a, b) => {
            if (uprOrder[a.upr] !== uprOrder[b.upr]) {
                return uprOrder[a.upr] - uprOrder[b.upr];
            }
            return patients.indexOf(a) - patients.indexOf(b);
        });


        const assignments = {};
        const litterPatients = sortedPatients.filter(patient => litterRequirements.includes(patient.requirements));
        const ambulatoryPatients = sortedPatients.filter(patient => !litterRequirements.includes(patient.requirements));

        const assignPatientAndAttendant = (patient, seatPool1, seatPool2) => {
            if (seatPool1.length > 0) {
                const seat = seatPool1.shift();
                assignments[seat.id] = patient.patient_id;

                const patientAttendants = attendants.filter(a => a.patient_id === patient.id);
                patientAttendants.forEach(attendant => {
                    if (seatPool1.length > 0) {
                        const attendantSeat = seatPool1.shift();
                        assignments[attendantSeat.id] = `attendant_${ attendant.id }`;
                    }
                });

            } else if (seatPool2.length > 0) {
                const seat = seatPool2.shift();
                assignments[seat.id] = patient.id;
                                    
                const patientAttendants = attendants.filter(a => a.patient_id === patient.id);
                patientAttendants.forEach(attendant => {
                    if (seatPool1.length > 0) {
                        const attendantSeat = seatPool1.shift();
                        assignments[attendantSeat.id] = `attendant_${ attendant.id }`;
                    }
                });
            };
        }
           // Assign litter patients
    litterPatients.forEach((patient, index) => {
        if (index % 2 === 0) {
            assignPatientAndAttendant(patient, leftLitterSeats, rightLitterSeats);
        } else {
            assignPatientAndAttendant(patient, rightLitterSeats, leftLitterSeats);
        }
    });

    // Assign ambulatory patients
    ambulatoryPatients.forEach((patient, index) => {
        if (index % 2 === 0) {
            assignPatientAndAttendant(patient, leftAmbulatorySeats, rightAmbulatorySeats);
        } else {
            assignPatientAndAttendant(patient, rightAmbulatorySeats, leftAmbulatorySeats);
        }
    });

        return assignments;
    };

    return { autoAssignPatients, loading, error };
};

export default useAutoAssign;