import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KeywordsInput from '../components/KeywordsInput';
import Sidebar from '../components/Sidebar';
import axios from '../services/axiosConfig';
import AccountVerificationReminder from '../components/AccountVerificationReminder';
import { jwtDecode } from 'jwt-decode';
import '../styles/CreateRoomPage.css';

const CreateRoomPage = () => {
    const [maxInteractions, setMaxInteractions] = useState(15);
    const [isPublic, setIsPublic] = useState(false);
    const [keywords, setKeywords] = useState('');
    const [totalRooms, setTotalRooms] = useState(0); // Estado para el total de salas creadas
    const [isVerified, setIsVerified] = useState(false); // Inicializado en false
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Efecto en CreatePage activado');

        const token = localStorage.getItem('token');
        console.log('Token obtenido del localStorage:', token);

        if (!token) {
            console.log('No se encontró token, redirigiendo a /');
            navigate('/');
            return;
        }

        let userId;
        try {
            const decodedToken = jwtDecode(token);
            userId = decodedToken.userId;
            console.log('Token decodificado:', decodedToken);
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            navigate('/');
            return;
        }

        if (!userId) {
            console.log('No se encontró userId, redirigiendo a /');
            navigate('/');
            return;
        }

        const checkVerificationStatus = async () => {
            console.log(`Verificando el estado del usuario con ID: ${userId}`);
            try {
                const response = await axios.get(`/user-settings/${userId}`);
                console.log('Respuesta completa de /user-settings/:userId', response.data);
        
                // Asegúrate de convertir el valor de IsVerified a booleano
                const verifiedStatus = Boolean(response.data.IsVerified);
                setIsVerified(verifiedStatus);
                console.log('Estado de verificación actualizado:', verifiedStatus);
            } catch (error) {
                console.error('Error al verificar el estado de la cuenta:', error);
            }
        };

        checkVerificationStatus();
    }, [navigate]);

    console.log('Estado actual de isVerified:', isVerified);

    useEffect(() => {
        // Consultar el número total de salas creadas por el usuario
        const fetchTotalRooms = async () => {
            try {
                const response = await axios.get('/user-total-rooms');
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
            const response = await axios.post('/create-room', { maxInteractions, isPublic, keywords });
            navigate('/room/' + response.data.roomCode);
            // Actualizar el estado para reflejar la sala recién creada
            setTotalRooms(totalRooms + 1);
        } catch (error) {
            console.error('Error al crear la sala:', error);
        }
    };

    const handleMaxInteractionsChange = (e) => {
        const value = parseInt(e.target.value, 10);
        // Asegúrate de que el valor esté dentro del rango 2-20
        if (value >= 2 && value <= 20) {
            setMaxInteractions(value);
        }
    };
    
    return (
        <div>
            {isVerified === false && (
                <AccountVerificationReminder token={localStorage.getItem('token')} />
            )}
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
