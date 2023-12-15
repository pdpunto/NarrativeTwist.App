import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContributionForm from '../components/ContributionForm';
import Sidebar from '../components/Sidebar';
import StoryDisplay from '../components/StoryDisplay';
import StoryStarters from '../components/StoryStarters';
import ContributorsList from '../components/StoryContributors';
import SharePopup from '../components/SharePopup';
import AccountVerificationReminder from '../components/AccountVerificationReminder';
import axios from '../services/axiosConfig';
import { jwtDecode } from 'jwt-decode';
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
  const navigate = useNavigate();

    // Función para mostrar la ventana emergente de compartir
    const handleContributionSuccess = (contributionText) => {
        setShowSharePopup(true);
        setLastContribution(contributionText);
    };

    // Función para actualizar las palabras clave
    const onKeywordsChange = (newKeywords) => {
      setKeywords(newKeywords);
    };

    

    useEffect(() => {
      console.log('Efecto en RoomPage activado');

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

    const handleSelectStarter = async (starter) => {
      try {
        await axios.post('/add-contribution', { roomCode, contributionText: starter });
        updateStoryAndKeywords(); // Actualiza la historia con la nueva contribución
      } catch (error) {
        console.error('Error al enviar la contribución inicial:', error);
      }
    };

    // Actualizar la historia y las palabras clave
    const updateStoryAndKeywords = async () => {
      try {
          const storyResponse = await axios.get(`/get-story/${roomCode}`);
          setStory(storyResponse.data.story);
          setIsFinalized(storyResponse.data.isFinalized);
          setRemainingInteractions(storyResponse.data.remainingInteractions);

          const keywordsResponse = await axios.get(`/get-keywords/${roomCode}`);
          setKeywords(keywordsResponse.data.keywords);
      } catch (error) {
          console.error('Error al obtener la historia y las palabras clave:', error);
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
        {isVerified === false && !isFinalized && (
          <>
            <AccountVerificationReminder token={localStorage.getItem('token')} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p>Debes verificar tu cuenta para poder contribuir a la historia.</p>
            </div>
          </>
        )}
        <div className="room-page-content">
          <div className="room-code-container" onClick={copyToClipboard} style={{ cursor: 'pointer' }}>
            <h1>Sala: {roomCode}</h1>
            {copySuccess && <div style={{ color: '#0b1e2b', fontSize: '10px' }}>{copySuccess}</div>}
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
          {isFinalized && <ContributorsList roomCode={roomCode} />}
          {!isFinalized && (
            isVerified ? (
              <ContributionForm roomCode={roomCode} updateStory={updateStoryAndKeywords} remainingInteractions={remainingInteractions} handleContributionSuccess={handleContributionSuccess} />
            ) : (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>La contribución a la historia está bloqueada hasta que verifiques tu cuenta.</p>
              </div>
            )
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
