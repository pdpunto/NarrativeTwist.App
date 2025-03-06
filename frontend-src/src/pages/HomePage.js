import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/axiosConfig';

import '../styles/HomePage.css';

const HomePage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!email || !password) {
            setErrorMessage('Nombre de usuario y contraseña son obligatorios');
            return;
        }

        try {
            const response = await axios.post('/api/login', {
                email,
                password
            });
            // Almacenar el token JWT en el almacenamiento local
            localStorage.setItem('token', response.data.token);
            console.log("Inicio de sesión exitoso");
            // Redirigir al usuario al lobby
            navigate('/lobby');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="login-page-container">
            <div className="logo-container">
                <img src="/NarrativeTwist.png" alt="NarrativeTwist Logo" />
            </div>
            <div className="login-container">
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Correo electrónico</label>
                        <input
                            type="text"
                            id="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Iniciar Sesión</button>
                </form>
                <div className="alternate-action">
                    ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
