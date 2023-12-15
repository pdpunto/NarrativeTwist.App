import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faCogs, faEllipsisH, faPencilAlt, faPlus,
  faSearch, faSignOutAlt, faTimes, faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import axios from '../services/axiosConfig';
import '../styles/Sidebar.css';
import AjustesUsuario from './AjustesUsuario';
  
const Sidebar = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [salasCreadas, setSalasCreadas] = useState([]);
    const [salasParticipadas, setSalasParticipadas] = useState([]);
    const [userInfo, setUserInfo] = useState({ Username: '', ProfilePicture: '' });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAjustesUsuarioVisible, setIsAjustesUsuarioVisible] = useState(false);
    const [editingRoomId, setEditingRoomId] = useState(null);
    const [customName, setCustomName] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [isEditing, setIsEditing] = useState(null);
    const navigate = useNavigate();

    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken.userId;
        }
        return null;
    };

    // Modifica esta función para alternar el estado
    const toggleRoomActions = (roomId) => {
        setSelectedRoomId(prevRoomId => prevRoomId === roomId ? null : roomId);
    };

    const openAjustesUsuario = () => setIsAjustesUsuarioVisible(true);
    const closeAjustesUsuario = () => setIsAjustesUsuarioVisible(false);

    useEffect(() => {
        const cargarSalas = async () => {
            const userId = getUserIdFromToken();
            if (userId) {
                try {
                    const salasResponse = await axios.get(`/user-rooms/${userId}`);
                    setSalasCreadas(salasResponse.data.filter(sala => sala.IsCreator));
                    setSalasParticipadas(salasResponse.data.filter(sala => !sala.IsCreator));

                    const userInfoResponse = await axios.get(`/user-info/${userId}`);
                    setUserInfo(userInfoResponse.data);
                } catch (error) {
                    console.error('Error al cargar salas o información del usuario:', error);
                }
            }
        };
        cargarSalas();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const navigateToRoom = (roomCode) => {
        if (editingRoomId === null) {
            navigate(`/room/${roomCode}`);
        }
    };

    // Nuevo estado para controlar qué sala muestra los botones de edición/eliminación
    const [hoveredSala, setHoveredSala] = useState(null);

    // Función para manejar el mouse entrando en una sala
    const handleMouseEnter = (salaId) => {
        setHoveredSala(salaId);
    };

    // Función para manejar el mouse saliendo de una sala
    const handleMouseLeave = () => {
        setHoveredSala(null);
    };


    const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);
    const renderProfilePicture = () => {
        const initial = userInfo.DisplayName ? userInfo.DisplayName[0].toUpperCase()
            : userInfo.Username ? userInfo.Username[0].toUpperCase()
            : 'U';

        return userInfo.ProfilePicture
            ? <img src={userInfo.ProfilePicture} alt="Profile" className="profile-picture" />
            : <div className="profile-picture-placeholder">{initial}</div>;
    };

    const toggleUserMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleCustomNameChange = (e) => {
        setCustomName(e.target.value);
    };

    const startEditing = (sala) => {
        setIsEditing(sala.RoomID); // Comienza a editar la sala
        setCustomName(sala.CustomRoomName || sala.RoomCode); // Establece el nombre actual en el input
    };
    
    const cancelEditing = () => {
        setIsEditing(null);
        setCustomName('');
    };
    
    const submitRename = async (roomCode) => {
        if (!roomCode || !customName) return;
      
        try {
          const response = await axios.put(`/rename-room/${roomCode}`, { customRoomName: customName });
          console.log(response.data); // Respuesta del servidor
      
          const updateRoomList = (rooms) => {
            return rooms.map(sala => {
              if (sala.RoomCode === roomCode) {
                return { ...sala, CustomRoomName: customName };
              }
              return sala;
            });
          };
      
          setSalasCreadas(updateRoomList(salasCreadas));
          setSalasParticipadas(updateRoomList(salasParticipadas));
          setIsEditing(null); // Finaliza el modo de edición
        } catch (error) {
          console.error('Error al renombrar la sala:', error);
        }
    };
      
    
    // Función para eliminar una sala
    const eliminarSala = async (roomId) => {
        // Aquí va la lógica para eliminar la sala
        console.log(`Eliminar sala con ID: ${roomId}`);
        try {
            await axios.delete(`/delete-room/${roomId}`);
            setSalasCreadas(salasCreadas.filter(sala => sala.RoomID !== roomId));
        } catch (error) {
            console.error('Error al eliminar la sala:', error);
        }
    };

    // Función para esconder una sala de la lista de "Otras Salas"
    const esconderSala = async (roomCode) => {
        console.log(`Eliminar sala con código: ${roomCode} de la lista del usuario`);
        try {
            // Aquí haces una solicitud al endpoint del servidor que eliminará la sala de la lista del usuario
            await axios.delete(`/remove-room-from-list/${roomCode}`);
            // Actualizar el estado para reflejar que la sala se ha eliminado de la lista del usuario
            setSalasParticipadas(salasParticipadas.filter(sala => sala.RoomCode !== roomCode));
        } catch (error) {
            console.error('Error al eliminar la sala de la lista:', error);
        }
    };
  
    return (
        <div className={`sidebar ${isSidebarVisible ? 'visible' : 'hidden'}`}>
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={isSidebarVisible ? faTimes : faBars} />
          </button>
    
          <div className="sidebar-content">
            <div className="title-with-button">
              <button onClick={() => navigate('/create-room')} className="icon-button">
                <FontAwesomeIcon icon={faPlus} style={{ color: '#0b1e2b' }} />
              </button>
              <h3>Mis Salas</h3>
            </div>
    
            <ul className="salas-lista">
              {salasCreadas.map(sala => (
                <li key={sala.RoomID} onMouseEnter={() => handleMouseEnter(sala.RoomID)} onMouseLeave={handleMouseLeave}>
                  {isEditing === sala.RoomID ? (
                    <input
                      type="text"
                      value={customName}
                      onChange={handleCustomNameChange}
                      onBlur={() => submitRename(sala.RoomCode)}
                      onKeyPress={(e) => e.key === 'Enter' && submitRename(sala.RoomCode)}
                      className="sala-edit-input" // Asegúrate de tener esta clase definida en tu CSS para estilos
                    />
                  ) : (
                    <div className={`sala-info ${hoveredSala === sala.RoomID ? 'hovered' : ''}`} onClick={() => navigateToRoom(sala.RoomCode)}>
                      <span className="sala-name">{sala.CustomRoomName || sala.RoomCode}</span>
                      <span className="sala-code">{sala.RoomCode}</span>
                    </div>
                  )}
                  <button className="icon-button more-options-button" onClick={() => toggleRoomActions(sala.RoomID)}>
                    <FontAwesomeIcon icon={faEllipsisH} />
                  </button>
                  {selectedRoomId === sala.RoomID && (
                    <div className="sala-actions">
                      <button onClick={() => startEditing(sala)} className="icon-button">
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button onClick={() => eliminarSala(sala.RoomID)} className="icon-button">
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
                <div className="title-with-button">
                    <button onClick={() => navigate('/join-room')} className="icon-button">
                        <FontAwesomeIcon icon={faSearch} style={{ color: '#0b1e2b' }} />
                    </button>
                    <h3>Otras Salas</h3>
                </div>
    
                <ul className="salas-lista">
                {salasParticipadas.map(sala => (
                    <li key={sala.RoomID} onMouseEnter={() => handleMouseEnter(sala.RoomID)} onMouseLeave={handleMouseLeave}>
                  {isEditing === sala.RoomID ? (
                    <input
                      type="text"
                      value={customName}
                      onChange={handleCustomNameChange}
                      onBlur={() => submitRename(sala.RoomCode)}
                      onKeyPress={(e) => e.key === 'Enter' && submitRename(sala.RoomCode)}
                      className="sala-edit-input" // Asegúrate de tener esta clase definida en tu CSS para estilos
                    />
                  ) : (
                    <div className={`sala-info ${hoveredSala === sala.RoomID ? 'hovered' : ''}`} onClick={() => navigateToRoom(sala.RoomCode)}>
                      <span className="sala-name">{sala.CustomRoomName || sala.RoomCode}</span>
                      <span className="sala-code">{sala.RoomCode}</span>
                    </div>
                  )}
                  <button className="icon-button more-options-button" onClick={() => toggleRoomActions(sala.RoomID)}>
                    <FontAwesomeIcon icon={faEllipsisH} />
                  </button>
                  {selectedRoomId === sala.RoomID && (
                    <div className="sala-actions">
                      <button onClick={() => startEditing(sala)} className="icon-button">
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button onClick={() => esconderSala(sala.RoomCode)} className="icon-button">
                        <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                    )}
                    </li>
                ))}
                </ul>
    
                <div className="user-profile" onClick={toggleUserMenu}>
                    {renderProfilePicture()}
                    <div className="user-info">
                        <span className="user-nick">{userInfo.DisplayName || 'Usuario'}</span>
                        <span className="user-fullname">{userInfo.Username}</span>
                    </div>
                </div>
    
                {isMenuOpen && (
                    <div className="user-menu">
                        <button onClick={openAjustesUsuario} className="menu-item">
                            <FontAwesomeIcon icon={faCogs} />
                            Ajustes de Usuario
                        </button>
                        <button onClick={handleLogout} className="menu-item">
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>
    
            {isAjustesUsuarioVisible && (
                <AjustesUsuario onClose={closeAjustesUsuario} />
            )}
        </div>
    );
    
    
  };
  
  export default Sidebar;
  