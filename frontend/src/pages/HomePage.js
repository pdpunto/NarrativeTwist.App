import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../services/axiosConfig';
import '../styles/HomePage.css';
import '../styles/Login.css';

const HomePage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!username || !password) {
            setErrorMessage('Nombre de usuario y contraseña son obligatorios');
            return;
        }

        try {
            const response = await axios.post('/login', {
                username,
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
                        <label htmlFor="username">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
