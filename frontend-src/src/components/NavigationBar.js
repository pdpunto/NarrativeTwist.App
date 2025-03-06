import React from 'react';
import { NavLink } from 'react-router-dom';

import '../styles/NavigationBar.css'; // Asegúrate de crear este archivo CSS para estilizar tu barra de navegación

function NavigationBar() {
    return (
        <nav className="navigation-bar">
            <ul>
                <li>
                    <NavLink to="/" activeClassName="active">
                        Inicio
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/register" activeClassName="active">
                        Crear cuenta
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/create-room" activeClassName="active">
                        Crear Sala
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/join-room" activeClassName="active">
                        Unirse a Sala
                    </NavLink>
                </li>
                {/* Puedes añadir más enlaces a otras páginas según necesites */}
            </ul>
        </nav>
    );
}

export default NavigationBar;
