import React, { useEffect, useState } from 'react';
import axios from '../services/axiosConfig';

import '../styles/StoryContributors.css';

const StoryContributors = ({ roomCode }) => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await axios.get(`/api/room-contributors/${roomCode}`);
        console.log(response.data.contributors); // Verificar la estructura de la respuesta
        setContributors(response.data.contributors);
      } catch (error) {
        console.error('Error al obtener los contribuyentes:', error);
      }
    };

    fetchContributors();
  }, [roomCode]);

  if (contributors.length === 0) {
    return <p>No hay contribuyentes para mostrar.</p>;
  }

  return (
    <div className="app-layout">
    <div className="story-contributors">
      <h3>Contribuyentes de la Historia</h3>
      <ul>
        {contributors.map((displayName, index) => {
          // No es necesario verificar la propiedad DisplayName ya que la respuesta es un array de strings
          return <li key={index}>{displayName}</li>;
        })}
      </ul>
    </div>
    </div>
  );
};

export default StoryContributors;
