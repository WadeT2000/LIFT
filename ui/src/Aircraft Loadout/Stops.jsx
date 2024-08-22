import React, { useState, useEffect } from 'react';
import './Stops.css';

const StopsInOrder = ({ onUpdateStops }) => {
  const [patients, setPatients] = useState([]);
  const [sortedStops, setSortedStops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uprOrder, setUprOrder] = useState({});

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

          // Extract unique UPR values and create UPR order
          const uniqueUPRs = [...new Set(data.map(patient => patient.upr))];
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

          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (patients.length && Object.keys(uprOrder).length) {
      // Sort patients first by UPR, then by their order in the original list
      const sortedPatients = [...patients].sort((a, b) => {
        if (uprOrder[a.upr] !== uprOrder[b.upr]) {
          return uprOrder[a.upr] - uprOrder[b.upr];
        }
        return patients.indexOf(a) - patients.indexOf(b);
      });

      // Extract unique stops from the sorted patients
      const uniqueStops = Array.from(new Set(sortedPatients.map(patient => patient.dds)));
      setSortedStops(uniqueStops);

      // Pass the sorted stops back to the parent component
      onUpdateStops(uniqueStops);
    }
  }, [patients, uprOrder]);

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
    onUpdateStops(newStops); // Update parent with reordered stops
  };

  if (isLoading) return <div className="stops-in-order">Loading stops...</div>;

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

export default StopsInOrder;
