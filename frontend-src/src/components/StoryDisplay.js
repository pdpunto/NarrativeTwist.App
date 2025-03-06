import React, { useEffect, useRef } from 'react';

import '../styles/StoryDisplay.css';

const StoryDisplay = ({ story, isFinalized, roomCode }) => {
  const storyDisplayRef = useRef(null);
  const timeoutRef = useRef(null); // Ref para almacenar la referencia del timeout actual

  useEffect(() => {
    storyDisplayRef.current.innerHTML = '';
    const words = story.split(' ');
    let currentIndex = 0;

    // Cancela el timeout actual y establece uno nuevo
    const addWord = () => {
      clearTimeout(timeoutRef.current);

      if (currentIndex < words.length) {
        const span = document.createElement('span');
        span.textContent = words[currentIndex] + ' ';

        span.className = isFinalized || currentIndex >= words.length - 15
          ? 'typewriter-animation visible-text'
          : 'typewriter-animation blurred-text';

        storyDisplayRef.current.appendChild(span);
        currentIndex++;
        storyDisplayRef.current.scrollTop = storyDisplayRef.current.scrollHeight;

        if (currentIndex < words.length) {
          timeoutRef.current = setTimeout(addWord, 100);
        }
      }
    };

    addWord();

    // Limpia el timeout al desmontar o al cambiar de sala
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [story, isFinalized, roomCode]); // Dependencias incluyen roomCode para reiniciar en cambio de sala

  return <div className="story-display" ref={storyDisplayRef}></div>;
};

export default StoryDisplay;
