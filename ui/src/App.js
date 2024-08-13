import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import LoginPage from './Login/Login';
import HomePage from './Home/Home';
import Logout from './Login/Logout';
import PatientList from './Home/PatientList';
import PatientEdit from './Home/PatientEdit';



export const AuthContext = React.createContext();

function App() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      setAuth(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <AuthContext.Provider value={{ auth, setAuth }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* <Route path="/registration" element={<Register />} /> */}
            <Route path='/home' element={<HomePage />} />
            {/* <Route path="/home" element={auth ? <HomePage /> : <Navigate to='/' />} /> */}
            <Route path="/logout" element={<Logout />} />
            <Route path="/PatientList" element={<PatientList />} />
            <Route path="/PatientEdit/:patientid" element={<PatientEdit />} />
          </Routes>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
