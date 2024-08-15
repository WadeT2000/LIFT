import React, { useState, useEffect } from 'react';
import './Stops.css';


const StopsInOrder = () => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      fetch('http://localhost:8080/patientsmission1')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setPatients(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        });
    }
    fetchData();
  }, []);


  const getUniqueStops = () => {
    const uniqueStops = new Set(patients.map(patient => patient.dds));
    return Array.from(uniqueStops);
  };

  const sortedStops = getUniqueStops().sort((a, b) => {
    const indexA = patients.findIndex(p => p.dds === a);
    const indexB = patients.findIndex(p => p.dds === b);
    return indexA - indexB;
  });


  if (isLoading) return <div className="stops-in-order">Loading stops...</div>

  return (
    <div className="stops-list">
      <h2> Stops in Order </h2>
      {sortedStops.length > 0 ? (
        <ul>
          {sortedStops.map((stop, index) => (
            <div key={stop.dds} className='stop-item'>
              <span className="stop-number"> {index + 1}</span>
              <span className="stop-code">{stop}</span>
            </div>
          ))}
        </ul>
      ) : (
        <p>No stops found.</p>
      )}
    </div>
  )
}

export default StopsInOrder;