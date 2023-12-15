import React, { useEffect, useRef } from 'react';
import '../styles/StoryDisplay.css'; // Asegúrate de importar tus estilos

const StoryDisplay = ({ story, isFinalized }) => {
  const storyDisplayRef = useRef(null);

  useEffect(() => {
    // Desplazar el scroll hacia la parte inferior del contenedor
    if (storyDisplayRef.current) {
      storyDisplayRef.current.scrollTop = storyDisplayRef.current.scrollHeight;
    }
  }, [story]); // Se ejecuta cada vez que 'story' cambie

  // Función para mostrar la historia completa o parcial
  const renderStory = () => {
    if (isFinalized) {
      // Si la historia está finalizada, mostrar la historia completa
      return <p>{story}</p>;
    } else {
      // Si no, mostrar solo las últimas 15 palabras
      const { visiblePart, blurredPart } = splitStory(story, 15);
      return (
        <>
          <p className="blurred-text">{blurredPart}</p>
          <p>{visiblePart}</p>
        </>
      );
    }
  };

  // Función para separar la historia en la parte borrosa y la parte visible
  const splitStory = (text, numberOfWords) => {
    const words = text.split(' ');
    const visiblePart = words.slice(-numberOfWords).join(' ');
    const blurredPart = words.slice(0, -numberOfWords).join(' ');
    return { visiblePart, blurredPart };
  };

  return (
    <div className="story-display" ref={storyDisplayRef}>
      {renderStory()}
    </div>
  );
};

export default StoryDisplay;
