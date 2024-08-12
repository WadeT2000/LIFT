const loginServer = 'http://localhost:8080/verify';

export default async function authenticate(fName, lName, username, password, requestType) {
  const res = await fetch(loginServer, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fname: fName,
      lname: lName,
      user: username,
      pass: password,
      type: requestType,
    }),
  })
    .then(res => res.json())
    .then(res => {return res;})
    .catch(error => {
      console.log(error);
      return { message: 'Error Connecting to the Server' };
    });

  return res;
};