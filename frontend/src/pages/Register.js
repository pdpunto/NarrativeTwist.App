import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/axiosConfig';

import '../styles/Register.css';


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();


    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!username || !password || !email) {
            setErrorMessage('Todos los campos son obligatorios');
            return;
        }

        try {
            const response = await axios.post('/register', {
                username,
                password,
                email
            });
            alert('Registro exitoso. Por favor, inicia sesión.');
            navigate('/');
            // Redirigir al login o a la página principal
        } catch (error) {
            setErrorMessage(error.response.data.message || 'Error al registrarse');
        }
    };

    return (
        
        <div>
            <h1>Registro</h1>
            <div className="register-container">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={handleRegister}>
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
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
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
                <button type="submit">Registrarse</button>
            </form>
            <div className="alternate-action">
                    ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>
                </div>
        </div>
    </div>
    );
};

export default Register;
