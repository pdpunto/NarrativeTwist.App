import React, { useEffect, useState } from 'react';
import '../styles/StoryContributors.css'
import axios from '../services/axiosConfig'; // Asegúrate de que la ruta es correcta

const StoryContributors = ({ roomCode }) => {
    const [contributors, setContributors] = useState([]);

    useEffect(() => {
        const fetchContributors = async () => {
            try {
                // Asegúrate de que el endpoint coincide con el configurado en tu servidor
                const response = await axios.get(`/room-contributors/${roomCode}`);
                // Asumiendo que la respuesta tiene un campo llamado "contributors" que es un array
                setContributors(response.data.contributors);
            } catch (error) {
                console.error('Error al obtener los contribuyentes:', error);
            }
        };

        fetchContributors();
    }, [roomCode]); // Dependencia de efecto: roomCode

    // Verificar si hay contribuyentes para mostrar
    if (contributors.length === 0) {
        return <p>No hay contribuyentes para mostrar.</p>;
    }

    return (
        <div className="story-contributors">
            <h3>Contribuyentes de la Historia</h3>
            <ul>
                {contributors.map((contributor, index) => (
                    <li key={index}>{contributor}</li> // Asegúrate de que "contributor" sea el dato que quieres mostrar
                ))}
            </ul>
        </div>
    );
};

export default StoryContributors;
