import React, { useEffect, useState } from 'react';
import axios from '../services/axiosConfig';
import { jwtDecode } from 'jwt-decode';
import '../styles/AjustesUsuario.css';

function AjustesUsuario({ onClose }) {
    const [usuario, setUsuario] = useState({ nombre: '', newPassword: '', nick: '', foto: '' });
    const [passwordActual, setPasswordActual] = useState('');

    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken.userId;
        }
        return null;
    };

    useEffect(() => {
        const userId = getUserIdFromToken();
        if (userId) {
            axios.get(`/user-settings/${userId}`)
                .then(response => {
                    const data = response.data;
                    setUsuario({
                        nombre: data.Username,
                        nick: data.DisplayName,
                        foto: data.ProfilePicture
                    });
                })
                .catch(error => console.error('Error:', error));
        }
    }, []);

    const handleInputChange = (event) => {
        setUsuario({ ...usuario, [event.target.name]: event.target.value });
    };

    const toTitleCase = (str) => {
        return str.replace(/\b(\w)/g, char => char.toUpperCase());
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const userId = getUserIdFromToken();

        if (!passwordActual) {
            alert('Por favor, ingresa tu contraseña actual para confirmar los cambios.');
            return;
        }

        if (userId) {
            const datosParaActualizar = {
                username: toTitleCase(usuario.nombre),
                displayName: toTitleCase(usuario.nick),
                profilePicture: usuario.foto,
                passwordActual
            };

            if (usuario.newPassword) {
                datosParaActualizar.newPassword = usuario.newPassword;
            }

            axios.put(`/update-user-settings/${userId}`, datosParaActualizar)
                .then(() => {
                    alert('Información actualizada');
                    onClose(); // Cerrar el modal después de actualizar
                })
                .catch(error => console.error('Error:', error));
        }
    };

    return (
        <div className="ajustes-usuario-modal">
            <div className="ajustes-usuario-contenido">
                <span className="ajustes-usuario-cerrar" onClick={onClose}>&times;</span>
                <form onSubmit={handleSubmit} className="ajustes-usuario-form">
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input type="text" name="nombre" value={usuario.nombre} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Nueva Contraseña:</label>
                        <input type="password" name="newPassword" value={usuario.newPassword} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Contraseña Actual (obligatoria para cambios):</label>
                        <input type="password" value={passwordActual} onChange={e => setPasswordActual(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Nick:</label>
                        <input type="text" name="nick" value={usuario.nick} onChange={handleInputChange} />
                    </div>
                    <button type="submit">Guardar Cambios</button>
                </form>
            </div>
        </div>
    );
}

export default AjustesUsuario;
