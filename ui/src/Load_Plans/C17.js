// import React, { useState } from 'react';
// import './C17.css'

// const C17LP = () => {
//   const [seats, setSeats] = useState(Array(54).fill(''));
//   const [middleStacks, setMiddleStacks] = useState(Array(18).fill(''));

//     const handleInputChange = (index, event, isMiddle) => {
//         if (isMiddle) {
//             const newMiddleStacks = [...middleStacks];
//             newMiddleStacks[index] = event.target.value;
//             setMiddleStacks(newMiddleStacks);
//         } else {
//             const newSeats = [...seats];
//             newSeats[index] = event.target.value;
//             setSeats(newSeats);
//         }
//     };

// return (
//     <div style={{
//         backgroundColor: '#344058', 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         padding: '20px',
//         alignItems: 'flex-start'
//         }}>
//       <div>
//         {seats.slice(0, 27).map((seat, index) => (
//           <input
//             key={`L${index + 1}`}
//             type="text"
//             value={seat}
//             onChange={(e) => handleInputChange(index, e, false)}
//             style={{ width: '50%', padding: '5px', marginBottom: '2px', textAlign: 'center' }}
//             placeholder={`L${index + 1}`}
//           />
//         ))}
//       </div>
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
//         {[...Array(12)].map((_, containerIndex) => (
//           <div key={`MCol${containerIndex + 1}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             {[...Array(3)].map((_, rowIndex) => {
//               const index = containerIndex * 3 + rowIndex;
//               return (
//                 <input
//                   key={`M${index + 1}`}
//                   type="text"
//                   value={middleStacks[index]}
//                   onChange={(e) => handleInputChange(index, e, true)}
//                   style={{ width: '200px', padding: '5px', marginBottom: '2px', textAlign: 'center' }}
//                   placeholder={`M${index + 1}`}
//                 />
//               );
//             })}
//           </div>
//         ))}
//       </div>
//       <div>
//         {seats.slice(27).map((seat, index) => (
//           <input
//             key={`R${index + 1}`}
//             type="text"
//             value={seat}
//             onChange={(e) => handleInputChange(index + 27, e, false)}
//             style={{ width: '50%', padding: '5px', marginBottom: '2px', textAlign: 'center' }}
//             placeholder={`R${index + 1}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
  
// }
// export default C17LP;
