import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KeywordsInput from '../components/KeywordsInput';
import Sidebar from '../components/Sidebar';
import axios from '../services/axiosConfig';

import '../styles/CreateRoomPage.css';

const CreateRoomPage = () => {
    const [maxInteractions, setMaxInteractions] = useState(15);
    const [isPublic, setIsPublic] = useState(false);
    const [keywords, setKeywords] = useState('');
    const [totalRooms, setTotalRooms] = useState(0); 
    const [isVerified, setIsVerified] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        let userId;
        try {
            const decodedToken = jwtDecode(token);
            userId = decodedToken.userId;
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            navigate('/');
            return;
        }

        if (!userId) {
            navigate('/');
            return;
        }

        const checkVerificationStatus = async () => {
            try {
                const response = await axios.get(`api/user-settings/${userId}`);
                const verifiedStatus = Boolean(response.data.IsVerified);
                setIsVerified(verifiedStatus);
            } catch (error) {
                console.error('Error al verificar el estado de la cuenta:', error);
            }
        };

        checkVerificationStatus();
    }, [navigate]);

    useEffect(() => {
        const fetchTotalRooms = async () => {
            try {
                const response = await axios.get('/api/user-total-rooms');
                setTotalRooms(response.data.totalRooms);
            } catch (error) {
                console.error('Error al obtener el total de salas:', error);
            }
        };

        fetchTotalRooms();
    }, []);

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        if (totalRooms >= 4) {
            alert('Has alcanzado el límite de salas que puedes crear. Elimina una sala existente para crear una nueva.');
            return;
        }

        try {
            const response = await axios.post('/api/create-room', { maxInteractions, isPublic, keywords });
            navigate('/room/' + response.data.roomCode);
            setTotalRooms(totalRooms + 1);
        } catch (error) {
            console.error('Error al crear la sala:', error);
        }
    };

    const handleMaxInteractionsChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 2 && value <= 20) {
            setMaxInteractions(value);
        }
    };
    
    return (
        <div>
            <div className="app-layout">
                <Sidebar />
                <div className="create-room-container">
                    <form onSubmit={handleCreateRoom}>
                        <div className="form-group">
                            <label htmlFor="maxInteractions">Máximo de Interacciones</label>
                            <input
                                type="number"
                                id="maxInteractions"
                                value={maxInteractions}
                                onChange={handleMaxInteractionsChange}
                                min="2"
                                max="20"
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                />
                                Sala Pública
                            </label>
                        </div>
                        <div className="form-group">
                            <KeywordsInput onKeywordsChange={setKeywords} />
                        </div>
                        <button type="submit" disabled={totalRooms >= 4}>Crear Sala</button>
                    </form>
                    {totalRooms >= 4 && (
                        <div className="limit-message">
                            Has alcanzado el límite total de salas. Elimina una sala para poder crear una nueva.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateRoomPage;
