// InteractionsCounter.js
import React, { useEffect, useState } from 'react';
import axios from '../services/axiosConfig';

const InteractionsCounter = ({ roomCode }) => {
  const [remainingInteractions, setRemainingInteractions] = useState(null);

  const fetchInteractionsData = async () => {
    try {
      const response = await axios.get(`/room-interactions/${roomCode}`);
      const { currentCount, maxInteractions } = response.data;
      setRemainingInteractions(maxInteractions - currentCount);
    } catch (error) {
      console.error('Error al obtener interacciones:', error);
    }
  };

  useEffect(() => {
    fetchInteractionsData();
    const interval = setInterval(fetchInteractionsData, 5000); // Actualiza cada 5 segundos

    return () => clearInterval(interval); // Limpiar al desmontar
  }, [roomCode]);

  return (
    <div className="interactions-counter">
      {remainingInteractions !== null && (
        <p>Interacciones restantes: {remainingInteractions}</p>
      )}
    </div>
  );
};

export default InteractionsCounter;
