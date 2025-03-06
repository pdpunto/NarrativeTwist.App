import { jwtDecode } from 'jwt-decode'; // Importa jwt-decode
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from '../services/axiosConfig';

import '../styles/JoinRoomPage.css';

function JoinRoomPage() {
    const [roomCode, setRoomCode] = useState('');
    const [publicRooms, setPublicRooms] = useState([]);
    const [isVerified, setIsVerified] = useState(false); // Estado para verificar si el usuario está verificado
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

        const checkVerificationStatus = async () => {
            try {
                const response = await axios.get(`/api/user-settings/${userId}`);
                setIsVerified(Boolean(response.data.IsVerified));
            } catch (error) {
                console.error('Error al verificar el estado de la cuenta:', error);
            }
        };

        checkVerificationStatus();

        const fetchPublicRooms = async () => {
            try {
                const response = await axios.get('/api/public-rooms');
                setPublicRooms(response.data);
            } catch (error) {
                console.error('Error al cargar salas públicas:', error);
            }
        };

        fetchPublicRooms();
    }, [navigate]);

    const handleJoinRoom = async (e, code) => {
        e.preventDefault();
        const roomCodeToJoin = code || roomCode;
        try {
            await axios.post('/api/join-room', { roomCode: roomCodeToJoin });
            navigate(`/room/${roomCodeToJoin}`);
        } catch (error) {
            console.error('Error al unirse a la sala:', error);
            alert('Error al unirse a la sala. Por favor, verifica el código e inténtalo de nuevo.');
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="join-room-main">
                <div className="join-room-search">
                    <form onSubmit={handleJoinRoom} className="join-room-form">
                        <div className="form-group">
                            <label htmlFor="roomCode">Código de Sala</label>
                            <input
                                type="text"
                                id="roomCode"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="join-room-button">Unirse a Sala</button>
                    </form>
                </div>
    
                <div className="public-rooms-section">
                    <h2 className="public-rooms-title">Salas Públicas</h2>
                    <ul className="public-rooms-list">
                        {publicRooms.map((room) => (
                            <li key={room.RoomID} className="public-room-item">
                                <div onClick={(e) => handleJoinRoom(e, room.RoomCode)}>
                                    <span className="title">Código: </span>
                                    <span className="value">{room.RoomCode}</span>
                                </div>
                                <div onClick={(e) => handleJoinRoom(e, room.RoomCode)}>
                                    <span className="title">Palabras clave: </span>
                                    <span className="value">{room.Keywords || 'No especificadas'}</span>
                                </div>
                                <div>
                                    <span className="title">Interacciones Restantes: </span>
                                    <span className="value">{room.MaxInteractions}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default JoinRoomPage;
