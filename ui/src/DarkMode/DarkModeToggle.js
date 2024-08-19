import { useContext } from 'react';
import { DarkModeContext } from './DarkModeContext';
import { Button } from 'primereact/button';

const DarkModeToggle = () => {
  const {darkMode, toggleDarkMode} = useContext(DarkModeContext);

  return(
    <Button className={`mode-toggle-button ${darkMode ? 'dark-mode' : 'light-mode'}`} onClick={toggleDarkMode}>
      {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </Button>
  )
}

export default DarkModeToggle;