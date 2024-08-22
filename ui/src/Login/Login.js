import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from "../App";
import authenticate from './Auth';
import './Login.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const rememberMe = Cookies.get('rememberMe') === 'true';
    const savedUsername = Cookies.get('username');
    if (rememberMe && savedUsername) {
      setUsername(savedUsername);
    }

    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);

    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const login = async (e) => {
    e.preventDefault();
    if (username === 'rickroll' || username === 'Rick Astley' || password === 'rickroll') {
      window.location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      return;
    }
    const userValidation = formValidation(username, `Username`);
    const passValidation = formValidation(password, `Password`);
    if (!userValidation && !passValidation) {
      const status = await authenticate('', '', username, password, 'login');
      if (checked) {
        Cookies.set('username', username);
        Cookies.set('rememberMe', 'true');
      } else {
        Cookies.remove('username');
        Cookies.set('rememberMe', 'false');
      }
      handleResponse(status);
    } else {
      let msg = '';
      if (userValidation) {
        msg = msg.concat(userValidation);
      }
      if (passValidation) {
        msg = msg.concat(passValidation);
      }
      handleAlert(msg);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login(e);
    }
  };

  const formValidation = (input, inputType) => {
    const strRegex = new RegExp(/^[a-z0-9]+$/i);
    const validChars = strRegex.test(input); 
    const validLength = (input.length >= 5) && (input.length <= 30);
    let message = '';
    if (!validChars) {
      message = message.concat(`Invalid Characters in ${inputType}, only alphanumeric characters are acceptable.\n`);
    }
    if (!validLength) {
      message = message.concat(`Invalid Length in ${inputType}, input must be 5-30 characters.\n`);
    }
    return validChars && validLength ? false : message;
  };

  const handleResponse = (res) => {
    if (res.token) {
      Cookies.set('auth_token', res.token);
      setAuth(true);
      navigate('/home');
    } else {
      alert(res.message);
    }
  };

  const handleAlert = (msg) => {
    alert(msg);
  };

  return (
    <div className={`loginbackground ${darkMode ? 'dark-mode' : ''}`}>
      <div className="loginbox">
        <form onSubmit={login}>
          <p className="loginUser">Username:</p>
          <input 
            type="text" 
            className='loginuserinput' 
            minLength="5" 
            maxLength="30" 
            placeholder={checked && username !== '' ? username : ""} 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            required
          /><br/>
          <p className="loginPass">Password:</p>
          <input 
            type="password" 
            className='loginpassinput' 
            minLength="5" 
            maxLength="30" 
            placeholder="" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          /><br/>
          <button type="submit" className="login-button">Login</button><br/>
          <button className="register-button" onClick={() => navigate('/registration')}>Create Account</button>
        </form>
      </div>
      <div className="toggle-container">
        <button 
          className={`mode-toggle-button ${darkMode ? 'dark-mode' : 'light-mode'}`} 
          onClick={toggleDarkMode}
        >
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
    </div>
  );
}
