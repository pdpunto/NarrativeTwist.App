import { jwtDecode } from 'jwt-decode'; // Corrección de la importación
import React, { useState } from 'react';
import axios from '../services/axiosConfig'; // Asegúrate de que la ruta es correcta

import '../styles/AccountVerificationReminder.css';

const AccountVerificationReminder = ({ token }) => {
  const [message, setMessage] = useState('');

  const handleResendVerification = async () => {
    try {
      // Decodificar el token para obtener userId
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // Envía una solicitud para reenviar el email de verificación
      const response = await axios.post('/api/resend-verification', { userId });
      setMessage(response.data); // Mensaje de éxito desde el servidor
    } catch (error) {
      // Asegúrate de manejar tanto errores de Axios como errores inesperados
      const errorMessage = error.response?.data || 'Error al reenviar el email. Inténtalo de nuevo más tarde.';
      console.error('Error al reenviar el email de verificación:', errorMessage);
      setMessage(errorMessage);
    }
  };

  return (
    <div className="verification-reminder">
      <p>
        Tu cuenta aún no ha sido verificada. Por favor, revisa tu email para activar tu cuenta.
        Si no has recibido el correo de verificación, <a href="#" onClick={handleResendVerification}>haz clic aquí</a> para reenviarlo.
      </p>
      {message && <p className="verification-message">{message}</p>}
    </div>
  );
};

export default AccountVerificationReminder;
