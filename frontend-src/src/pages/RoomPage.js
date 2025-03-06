import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContributionForm from '../components/ContributionForm';
import SharePopup from '../components/SharePopup';
import Sidebar from '../components/Sidebar';
import ContributorsList from '../components/StoryContributors';
import StoryDisplay from '../components/StoryDisplay';
import StoryStarters from '../components/StoryStarters';
import axios from '../services/axiosConfig';

import '../styles/RoomPage.css';

function RoomPage() {
  const { roomCode } = useParams();
  const [story, setStory] = useState('');
  const [isFinalized, setIsFinalized] = useState(false);
  const [remainingInteractions, setRemainingInteractions] = useState(0);
  const [keywords, setKeywords] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [lastContribution, setLastContribution] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // Función para mostrar la ventana emergente de compartir
  const handleContributionSuccess = (contributionText) => {
    setShowSharePopup(true);
    setLastContribution(contributionText);
  };

  // Función para actualizar las palabras clave
  const onKeywordsChange = (newKeywords) => {
    setKeywords(newKeywords);
  };

  // Actualizar la historia y las palabras clave
  const updateStoryAndKeywords = async () => {
    try {
      // Agregar el encabezado 'No-Auth-Redirect' para evitar la redirección automática
      const storyResponse = await axios.get(`/api/get-story/${roomCode}`, {
        headers: { 'No-Auth-Redirect': 'true' }
      });
      setStory(storyResponse.data.story);
      setIsFinalized(storyResponse.data.isFinalized);
      setRemainingInteractions(storyResponse.data.remainingInteractions);

      const keywordsResponse = await axios.get(`/api/get-keywords/${roomCode}`, {
        headers: { 'No-Auth-Redirect': 'true' }
      });
      setKeywords(keywordsResponse.data.keywords);
    } catch (error) {
      console.error('Error al obtener la historia y las palabras clave:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsVerified(decodedToken.userId !== undefined);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
    updateStoryAndKeywords();
  }, [roomCode]);

  const handleSelectStarter = async (starter) => {
    try {
      await axios.post('/api/add-contribution', { 
        roomCode, 
        contributionText: starter 
      }, {
        headers: { 'No-Auth-Redirect': 'true' }
      });
      updateStoryAndKeywords();
    } catch (error) {
      console.error('Error al enviar la contribución inicial:', error);
    }
  };

  // Función para copiar el código de la sala al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopySuccess('Código copiado al portapapeles');
      setTimeout(() => setCopySuccess(''), 3000);
    });
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="room-page-content">
        <div className="room-code-container" onClick={copyToClipboard} style={{ cursor: 'pointer' }}>
          <h1>Sala: {roomCode}</h1>
          {copySuccess && <div style={{ color: '#2a4857', fontSize: '10px' }}>{copySuccess}</div>}
        </div>
        {keywords && (
          <div className="keywords-display">
            <h3>Palabras clave:</h3>
            {keywords.split(',').map((keyword, index) => (
              <span key={index} className="keyword">{keyword.trim()}</span>
            ))}
          </div>
        )}
        {!story && !isFinalized && <StoryStarters onSelectStarter={handleSelectStarter} />}
        <StoryDisplay story={story} isFinalized={isFinalized} />
        {isFinalized && <ContributorsList className="contributors-list" roomCode={roomCode} />}

        {!isFinalized && isVerified && (
          <ContributionForm
            roomCode={roomCode}
            updateStory={updateStoryAndKeywords}
            remainingInteractions={remainingInteractions}
            handleContributionSuccess={handleContributionSuccess}
          />
        )}
        <SharePopup
          isOpen={showSharePopup}
          contributionText={lastContribution}
          onClose={() => setShowSharePopup(false)}
          roomCode={roomCode}
        />
      </div>
    </div>
  );
}

export default RoomPage;
