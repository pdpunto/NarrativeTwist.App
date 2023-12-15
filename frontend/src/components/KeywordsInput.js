import React, { useState } from 'react';

const KeywordsInput = ({ onKeywordsChange }) => {
  const [keyword1, setKeyword1] = useState('');
  const [keyword2, setKeyword2] = useState('');
  const [keyword3, setKeyword3] = useState('');

  const handleChange = () => {
    // Combina las palabras clave en una cadena separada por comas
    const combinedKeywords = [keyword1, keyword2, keyword3].filter(kw => kw.trim() !== '').join(', ');
    // Notifica al componente padre sobre el cambio
    onKeywordsChange(combinedKeywords);
  };

  return (
    <div className="keywords-input-container">
      <label>Palabras Clave:</label>
      <input
        type="text"
        value={keyword1}
        onChange={(e) => { setKeyword1(e.target.value); handleChange(); }}
        placeholder="Palabra clave 1"
      />
      <input
        type="text"
        value={keyword2}
        onChange={(e) => { setKeyword2(e.target.value); handleChange(); }}
        placeholder="Palabra clave 2"
      />
      <input
        type="text"
        value={keyword3}
        onChange={(e) => { setKeyword3(e.target.value); handleChange(); }}
        placeholder="Palabra clave 3"
      />
    </div>
  );
};

export default KeywordsInput;
