import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css'

const Header = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/lobby');
        } else {
            navigate('/');
        }
    };

    return (
        <header className="App-header">
            <img 
                src={`${process.env.PUBLIC_URL}/NarrativeTwist.png`} 
                alt="NarrativeTwist" 
                className="App-logo" 
                onClick={handleLogoClick} 
            />
        </header>
    );
};

export default Header;
