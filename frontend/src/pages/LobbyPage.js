import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/axiosConfig';
import Sidebar from '../components/Sidebar';
import AccountVerificationReminder from '../components/AccountVerificationReminder';
import '../styles/LobbyPage.css';
import { jwtDecode } from 'jwt-decode';
const LobbyPage = () => {
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;
                axios.get(`/user-settings/${userId}`)
                    .then(response => {
                        setIsVerified(response.data.IsVerified);
                    })
                    .catch(error => console.error('Error al verificar el estado de la cuenta:', error));
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                navigate('/');
            }
        }
    }, [navigate]);

    const handleCreateRoom = () => {
        if (isVerified) {
            navigate('/create-room');
        } else {
            alert("Necesitas verificar tu cuenta para crear una sala.");
        }
    };

    const handleJoinRoom = () => {
        navigate('/join-room');
    };

    return (
        <div>
            {!isVerified && <AccountVerificationReminder token={localStorage.getItem('token')} />}
            <div className="app-layout">
                <Sidebar />
                <div className="button-group">
                    <button onClick={handleCreateRoom} disabled={!isVerified} className={!isVerified ? 'disabled-button' : ''}>Crear Sala</button>
                    <button onClick={handleJoinRoom}>Unirse a Sala</button>
                    {!isVerified && <p className="verification-info">Solo las cuentas verificadas pueden crear salas.</p>}
                </div>
            </div>
        </div>
    );
};

export default LobbyPage;
