import { useEffect, createContext, useState} from 'react';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({children}) => {
  const [darkMode, setDarkmode] = useState(false);
};

useEffect(() => {
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


return(
  <DarkModeContext.Provider value={{darkMode, toggleDarkMode}}>
    {children}
  </DarkModeContext.Provider>
)
