import React, { useState, useEffect } from 'react';
import './Stops.css';


const StopsInOrder = () => {
  const [patients, setPatients] = useState([]);
  const [sortedStops, setSortedStops] = useState([]);
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

  
  useEffect(() => {
    const uniqueStops = Array.from(new Set(patients.map(patient => patient.dds)));
    const sorted = uniqueStops.sort((a, b) => {
      const indexA = patients.findIndex(p => p.dds === a);
      const indexB = patients.findIndex(p => p.dds === b);
      return indexA - indexB;
    });
    setSortedStops(sorted);
  }, [patients]);

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
  }


  if (isLoading) return <div className="stops-in-order">Loading stops...</div>

  return (
    <div className="stops-list">
      <h2> Stops in Order </h2>
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