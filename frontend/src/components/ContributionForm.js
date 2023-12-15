import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import axios from '../services/axiosConfig';
import '../styles/ContributionForm.css'; // Asegúrate de que el archivo de estilos existe y está correctamente importado

const MAX_CHARACTERS = 250;

const ContributionForm = ({ roomCode, updateStory, remainingInteractions, handleContributionSuccess }) => {
    const [contribution, setContribution] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!contribution.trim()) {
            alert('Por favor, escribe tu contribución a la historia.');
            return;
        }

        try {
            // Enviar la contribución al servidor
            await axios.post('/add-contribution', { roomCode, contributionText: contribution.trim() });
            setContribution('');
            updateStory(); // Actualizar la historia en la página principal después de enviar la contribución

            // Llamar a handleContributionSuccess con la última contribución
            handleContributionSuccess(contribution.trim());
        } catch (error) {
            console.error('Error al enviar la contribución:', error);
        }
    };

    const handleCharacterChange = (e) => {
        if (e.target.value.length <= MAX_CHARACTERS) {
            setContribution(e.target.value);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="contribution-form">
            <div className="form-group">
                <textarea
                    id="contribution"
                    value={contribution}
                    onChange={handleCharacterChange}
                    placeholder="Añade aquí tu parte de la historia..."
                    maxLength={MAX_CHARACTERS}
                    className="contribution-textarea"
                />
                <div className="character-counter">
                    {MAX_CHARACTERS - contribution.length} caracteres restantes
                </div>
                <button type="submit" className="send-contribution-button" title="Enviar Contribución">
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
            {remainingInteractions !== undefined && (
                <div className="interaction-counter">
                    Interacciones restantes: {remainingInteractions}
                </div>
            )}
        </form>
    );
}

export default ContributionForm;
