import React from 'react';
import '../styles/Loading.css'; // Asegúrate de que el archivo de estilos está correctamente vinculado

function Loading() {
  return (
    <div className="loading-container">
      <img src="/Loading.png" alt="Cargando..." className="loading-image" />
    </div>
  );
}

export default Loading;
