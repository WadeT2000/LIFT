import React, { useState } from 'react';
import PatientTable from './patientTable';

const LP = () => {
  const [seats, setSeats] = useState(Array(54).fill(''));
  const [middleStacks, setMiddleStacks] = useState(Array(18).fill(''));
  const [dragPatient, setDragPatient] = useState(null);

  const handleInputChange = (index, event, isMiddle) => {
    if (isMiddle) {
      const newMiddleStacks = [...middleStacks];
      newMiddleStacks[index] = event.target.value;
      setMiddleStacks(newMiddleStacks);
    } else {
      const newSeats = [...seats];
      newSeats[index] = event.target.value;
      setSeats(newSeats);
    }
  };

  const handleDragStart = (index, isMiddle, event) => {
    setDragPatient({ index, isMiddle });
    setTimeout(() => event.target.classList.add('hide'), 0);
  };

  const handleDragEnd = (event) => {
    event.target.classList.remove('hide');
  };

  const handleDrop = (index, isMiddle) => {
    if (dragPatient) {
      const { index: fromIndex, isMiddle: fromIsMiddle } = dragPatient;

      if (fromIsMiddle === isMiddle) {
        // Same section swap
        if (isMiddle) {
          const newMiddleStacks = [...middleStacks];
          [newMiddleStacks[fromIndex], newMiddleStacks[index]] = [middleStacks[index], middleStacks[fromIndex]];
          setMiddleStacks(newMiddleStacks);
        } else {
          const newSeats = [...seats];
          [newSeats[fromIndex], newSeats[index]] = [seats[index], seats[fromIndex]];
          setSeats(newSeats);
        }
      } else {
        // Different section swap
        if (isMiddle) {
          const newMiddleStacks = [...middleStacks];
          const newSeats = [...seats];
          [newMiddleStacks[index], newSeats[fromIndex]] = [seats[fromIndex], middleStacks[index]];
          setMiddleStacks(newMiddleStacks);
          setSeats(newSeats);
        } else {
          const newMiddleStacks = [...middleStacks];
          const newSeats = [...seats];
          [newSeats[index], newMiddleStacks[fromIndex]] = [middleStacks[fromIndex], seats[index]];
          setMiddleStacks(newMiddleStacks);
          setSeats(newSeats);
        }
      }

      setDragPatient(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const patients = [
    { name: 'John Doe', condition: 'Stable' },
    { name: 'Jane Smith', condition: 'Critical' },
    // Add more patients as needed
  ];

  return (
    <div style={{
      backgroundColor: '#344058',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '20px',
      alignItems: 'flex-start'
    }}>
      <div>
        {seats.slice(0, 27).map((seat, index) => (
          <input
            key={`L${index + 1}`}
            type="text"
            value={seat}
            onChange={(e) => handleInputChange(index, e, false)}
            style={{ width: '50%', padding: '5px', marginBottom: '2px', textAlign: 'center' }}
            placeholder={`L${index + 1}`}
            draggable
            onDragStart={(e) => handleDragStart(index, false, e)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index, false)}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {middleStacks.map((seat, index) => (
          <input
            key={`M${index + 1}`}
            type="text"
            value={seat}
            onChange={(e) => handleInputChange(index, e, true)}
            style={{ width: '200px', padding: '5px', marginBottom: '2px', textAlign: 'center' }}
            placeholder={`M${index + 1}`}
            draggable
            onDragStart={(e) => handleDragStart(index, true, e)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index, true)}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
      <div>
        {seats.slice(27).map((seat, index) => (
          <input
            key={`R${index + 1}`}
            type="text"
            value={seat}
            onChange={(e) => handleInputChange(index + 27, e, false)}
            style={{ width: '50%', padding: '5px', marginBottom: '2px', textAlign: 'center' }}
            placeholder={`R${index + 1}`}
            draggable
            onDragStart={(e) => handleDragStart(index + 27, false, e)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index + 27, false)}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
      <div> <PatientTable/> </div>
    </div>
  );
};

export default LP;
