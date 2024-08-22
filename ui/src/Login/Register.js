import { useNavigate } from "react-router-dom";
import { useState} from "react";
import authenticate from './Auth';
import './Register.css';
// import '/path/to/your/Register.css';

export default function Register() {
   const navigate = useNavigate();
   const [fName, setFname] = useState('');
   const [lName, setLname] = useState('');
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');



   const handlealert = (msg) => {
       alert(msg)
     }


   const register = async (e) => {
       e.preventDefault();
       let fNameValidation = nameformValidation(fName, `First Name`);
       let lNameValidation = nameformValidation(lName, `Last Name`);
       let userValidation = formValidation(username, `Username`);
       let passValidation = formValidation(password, `Password`);
       if (!fNameValidation && !lNameValidation && !userValidation && !passValidation){
         const status = await authenticate(fName, lName, username, password, 'create');
         handleResponse(status);
       } else {
         let msg = '';
         if(fNameValidation){
           msg = msg.concat(fNameValidation);
         }
         if (lNameValidation){
           msg = msg.concat(lNameValidation);
         }
         if (userValidation){
           msg = msg.concat(userValidation);
         }
         if (passValidation){
           msg = msg.concat(passValidation);
         }
         handlealert(msg)
       }
     };

   const formValidation = (input, inputType) => {
       let strRegex = new RegExp(/^[a-z0-9]+$/i);
       let validChars = strRegex.test(input); 
       let validLength =(input.length >=5) && (input.length <=30);
       let message = '';
       if (!validChars){
         message = message.concat(`Invalid Characters in ${inputType}, only alphanumeric characters are acceptable.\n`)
       }
       if (!validLength){
         message = message.concat(`Invalid Length in ${inputType}, input must be 5-30 characters.\n`)
       }
       if (validChars && validLength){
         return false;
       } else {
         return message
       }
   };

   const nameformValidation = (input, inputType) => {
       let strRegex = new RegExp(/^[a-z0-9]+$/i);
       let validChars = strRegex.test(input); 
       let validLength =(input.length >=1) && (input.length <=30);
       let message = '';
       if (!validChars){
         message = message.concat(`Invalid Characters in ${inputType}, only alphanumeric characters are acceptable.\n`)
       }
       if (!validLength){
         message = message.concat(`Invalid Length in ${inputType}, input must be 5-30 characters.\n`)
       }
       if (validChars && validLength){
         return false;
       } else {
         return message
       }
   };


   const handleResponse = (res) => {
         alert(res.message)
         navigate('/')
     };



   return (
       <div>
           <div className="registerbox"> 
               <button className="logback" onClick={() => navigate('/')}>Back to Login</button><br/>
               <p className="registerfname">First Name:</p>
               <input type="text" className="regfnameinput" minLength="1" maxLength="30" placeholder="" value={fName} onChange={(e) => setFname(e.target.value)} required/>
               <p className="registerlname">Last Name:</p>
               <input type="text" className="reglnameinput" minLength="1" maxLength="30" placeholder="" value={lName} onChange={(e) => setLname(e.target.value)} required/>
               <p className="registeruname">Username:</p>
               <input type="text" className="reguserinput" minLength="5" maxLength="30" placeholder="" value={username} onChange={(e) => setUsername(e.target.value)} required/><br/>
               <p className="registerpass">Password:</p>
               <input type="password" className="regpassinput" minLength="5" maxLength="30" placeholder="" value={password} onChange={(e) => setPassword(e.target.value)} required/><br/>
               <button className="registorpbutt" onClick={(e)=>register(e)}>Register</button>
           </div>
       </div>
   )
}
