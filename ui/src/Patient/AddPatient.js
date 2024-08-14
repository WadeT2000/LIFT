const additemServer = 'http://localhost:8080/addpatient';

export default async function addPatient(patientInfo, attendantsInfo) {
  const response = await fetch(additemServer, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patientInfo: patientInfo,
      attendantInfo: attendantsInfo,
    }),
  })
  .then(res => res.json())
  .then(res => {return res;})
  .catch(error => {
    console.log(error);
    return { message: 'Error Connecting to the Server' };
  });
  
  return response;
}