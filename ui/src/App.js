import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import LoginPage from './Login/Login';
import HomePage from './Home/Home';
import Logout from './Login/Logout';
import PatientList from './Patient/PatientList';
import PatientEdit from './Patient/PatientEdit';
import AddPatientPage from './Patient/AddPatientPage';
import PatientTable from './Aircraft Loadout/patientTable';
import { PrimeReactProvider } from 'primereact/api';
import Load from './Aircraft Loadout/load';

//touchscreen dependancies
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
// import { isTouchDevice } from './utils'; 



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

  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  return (
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}> 
      <PrimeReactProvider>
        <Router>
          <AuthContext.Provider value={{ auth, setAuth }}>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                {/* <Route path="/registration" element={<Register />} /> */}
                <Route path='/home' element={<HomePage />} />
                {/* <Route path="/home" element={auth ? <HomePage /> : <Navigate to='/' />} /> */}
                <Route path="/logout" element={<Logout />} />
                <Route path="/PatientList" element={<PatientList />} />
                <Route path="/PatientAddPage" element={<AddPatientPage />} />
                <Route path="/lp" element={<Load />} />
                {/* Will Delete */}
                <Route path='/table' element={<PatientTable />} />
                <Route path="/PatientEdit/:patientid" element={<PatientEdit />} />
            </Routes>
          </AuthContext.Provider>
        </Router>
      </PrimeReactProvider>
    </DndProvider>
  );
}

export default App;
