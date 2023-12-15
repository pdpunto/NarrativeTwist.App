import React, { useEffect, useState } from 'react';
import '../styles/StoryStarters.css'

// Componente StoryStarters
const StoryStarters = ({ onSelectStarter }) => {
  // Agrupando inicios de historias por géneros
  const startersByGenre = {
    Historico: [
      "En los albores del siglo XX, mientras la ciudad de París...",
      "Era 1942, y las calles de Varsovia susurraban con el temor...",
      "En los tiempos de la Revolución Francesa, una joven enmascarada...",
      "Durante el reinado de Isabel la Católica, un mapa secreto cambió el destino de...",
      "A medida que el Imperio Romano caía, una oscura verdad se desvelaba...",
      "Mientras las pirámides de Egipto se erguían, un faraón descubría un antiguo secreto...",
      "En la corte de Luis XIV, un intrépido espía desvelaba conspiraciones...",
      "A bordo del Titanic, un amor prohibido florecía contra todo pronóstico...",
      "En las trincheras de la Primera Guerra Mundial, un soldado encontraba esperanza...",
      "En la antigua Roma, un gladiador luchaba por su libertad y su vida..."
    ],
    Romantico: [
      "Cuando Emma vio a Lucas en la pequeña librería del pueblo...",
      "En la ajetreada Nueva York, dos almas solitarias se encontraron bajo la lluvia...",
      "Bajo la luz de la luna en Venecia, dos amantes sellaban un amor eterno...",
      "El destino cruzó sus caminos en el menos esperado de los lugares: un tren en marcha...",
      "En un café parisino, un encuentro casual se convertía en algo más...",
      "Una carta olvidada llevó a Clara a descubrir el amor de su vida...",
      "Un verano en la costa Amalfitana cambió la vida de Sofia para siempre...",
      "Un baile de máscaras reveló una pasión oculta entre dos desconocidos...",
      "En un jardín secreto, dos corazones heridos encontraron consuelo...",
      "Un mensaje en una botella unió dos almas destinadas a amarse..."
    ],
    Terror: [
      "La casa al final de la calle siempre había sido objeto de rumores oscuros...",
      "Cada noche, los sueños de Ana se poblaron de sombras y susurros...",
      "En el bosque prohibido, una presencia oscura acechaba a los incautos...",
      "Una maldición ancestral atormentaba a la familia desde generaciones...",
      "En el sótano de la antigua mansión, un oscuro secreto esperaba ser descubierto...",
      "Durante la noche de Halloween, un grupo de amigos encontró algo más que dulces...",
      "Una ouija en una casa abandonada abrió la puerta a un mundo terrorífico...",
      "El espejo del ático escondía un reflejo que no pertenecía a este mundo...",
      "En el hospital psiquiátrico abandonado, los gritos del pasado aún resonaban...",
      "Una excursión al cementerio local se convirtió en una pesadilla inimaginable..."
    ],
    Epico: [
      "En un reino dividido por la guerra, un joven herrero descubría que su destino...",
      "Más allá de los mares conocidos, en tierras olvidadas por el tiempo...",
      "La profecía hablaba de un héroe que emergería en la hora más oscura...",
      "En un mundo de magia y monstruos, una guerrera emprendía un viaje épico...",
      "Una antigua espada forjada en dragónfuego era la clave para salvar el reino...",
      "La alianza entre elfos y humanos se tambaleaba ante la amenaza inminente...",
      "En las profundidades del bosque encantado, un secreto milenario aguardaba...",
      "El trono había sido usurpado, y solo un verdadero rey podría reclamarlo...",
      "Los dioses del Olimpo descendieron para participar en el destino de los mortales...",
      "Un portal mágico abría el camino a un mundo donde la fantasía se hacía realidad..."
    ]
  };  

  // Estado para los inicios aleatorios
  const [randomStarters, setRandomStarters] = useState([]);

  // Función para obtener un inicio aleatorio de cada género
  const getRandomStarters = () => {
    const starters = [];
    Object.keys(startersByGenre).forEach(genre => {
      const genreStarters = startersByGenre[genre];
      starters.push(genreStarters[Math.floor(Math.random() * genreStarters.length)]);
    });
    return starters;
  };

  useEffect(() => {
    setRandomStarters(getRandomStarters());
  }, []);

  return (
    <div className="starters-container">
      <div className="starters-grid">
        {randomStarters.map((starter, index) => (
          <div key={index} className="starter-item" onClick={() => onSelectStarter(starter)}>
            {starter}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryStarters;