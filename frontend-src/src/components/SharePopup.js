import React from 'react';
import { FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton
} from 'react-share';

import '../styles/SharePopup.css';

const SharePopup = ({ isOpen, contributionText, onClose, roomCode }) => {
    if (!isOpen) return null;

    // Función para obtener las últimas 15 palabras de la contribución
    const getLastWords = text => {
        const words = text.split(' ');
        if (words.length <= 15) {
            return text;
        }
        return '...' + words.slice(-15).join(' ');
    };

    const lastWords = getLastWords(contributionText);
    const formattedText = `"${lastWords}"`;

    const title = `Acabo de añadir un giro inesperado a la historia en NarrativeTwist! 🌟 `;
    const callToAction = `¿Te animas a continuar esta historia conmigo?`;
    const shareUrl = `http://www.narrativetwist.app/room/${roomCode}`;
    const fullMessage = title + '\n\n' + callToAction + '\n\n' + formattedText;

    return (
        <div className="share-popup">
            <div className="share-popup-content">
                <button onClick={onClose}>Cerrar</button>
                <h3>¡Haz que tu historia llegue más lejos!</h3>
                <h5>Invita a tus amigos a sumergirse en esta aventura y ver qué rumbo toma la historia con sus propias contribuciones.</h5>
                <p>{formattedText}</p>
                <div className="share-buttons">
                    <FacebookShareButton url={shareUrl} quote={fullMessage}>
                        <FaFacebookF size={32} />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl} title={fullMessage}>
                        <FaTwitter size={32} />
                    </TwitterShareButton>
                    <WhatsappShareButton url={shareUrl} title={fullMessage}>
                        <FaWhatsapp size={32} />
                    </WhatsappShareButton>
                    {/* Más botones de compartir si lo necesitas */}
                </div>
            </div>
        </div>
    );
};

export default SharePopup;


