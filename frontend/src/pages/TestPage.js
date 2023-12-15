// Página de prueba simple
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';


const TestPage = () => {
  
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };
    
    
    return <div>
      <button className="toggle-sidebar" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={isSidebarVisible ? faTimes : faBars} />
            </button>
            <Sidebar />
    </div>;
  };
  
export default TestPage;