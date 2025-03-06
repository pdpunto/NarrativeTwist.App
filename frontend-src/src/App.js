import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CreateRoomPage from './pages/CreateRoomPage';
import HomePage from './pages/HomePage';
import JoinRoomPage from './pages/JoinRoomPage';
import LobbyPage from './pages/LobbyPage';
import Register from './pages/Register';
import RoomPage from './pages/RoomPage';
import Loading from './components/Loading'; 
import VerifyAccount from './pages/VerifyAccount';
import './styles/App.css';
import TestPage from './pages/TestPage';


function App() {
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar la visibilidad de la imagen de carga

    return (
        <div className="App">
            {isLoading && <Loading />} {/* Renderiza el componente de carga si isLoading es true */}
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />

                    {/* Las siguientes rutas incluirán el Header */}
                    <Route path="/verify/:token" element={<VerifyAccount />} />
                    <Route path="/create-room" element={<><Header /><CreateRoomPage /></>} />
                    <Route path="/join-room" element={<><Header /><JoinRoomPage /></>} />
                    <Route path="/room/:roomCode" element={<><Header /><RoomPage /></>} />
                    <Route path="/register" element={<><Header /><Register /></>} />
                    <Route path="/lobby" element={<><Header /><LobbyPage /></>} />
                    <Route path="/test" element={<><Header /><TestPage /></>} />
                    {/* Puedes agregar más rutas según sea necesario */}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
