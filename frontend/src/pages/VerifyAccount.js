import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../services/axiosConfig';
import '../styles/VerifyAccount.css';

const VerifyAccount = () => {
    const { token } = useParams();
    const [verificationStatus, setVerificationStatus] = useState({
        verified: false,
        message: ''
    });

    const verifyAccount = async () => {
        try {
            const response = await axios.get(`/verify-account/${token}`);
            setVerificationStatus({
                verified: true,
                message: 'Cuenta verificada con éxito. ¡Gracias por unirte!'
            });
        } catch (error) {
            console.error('Error al verificar la cuenta:', error);
            setVerificationStatus({
                verified: false,
                message: 'Error al verificar la cuenta. Por favor, intenta de nuevo.'
            });
        }
    };

    return (
        <div className="verify-account-container">
            <Link to="/lobby">
                <img src="/NarrativeTwist.png" alt="NarrativeTwist Logo" style={{ maxWidth: '200px', marginBottom: '20px', cursor: 'pointer' }} />
            </Link>
            {verificationStatus.verified ? (
                <h1>{verificationStatus.message}</h1>
            ) : (
                <div>
                    <h1>Verificación de Cuenta</h1>
                    <button className="verify-account-button" onClick={verifyAccount}>
                        Verificar Cuenta
                    </button>
                </div>
            )}
        </div>
    );
};

export default VerifyAccount;
