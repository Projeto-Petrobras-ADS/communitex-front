import React from 'react';
import { NavLink } from 'react-router-dom';
import './Menu.css';
import PetrobrasLogo from '../../assets/logo/logo.png'; // Ajuste o caminho conforme sua estrutura

const Menu = () => {
  return (
    <nav className="petrobras-menu">
      <div className="menu-logo-container">
        <NavLink to="/">
          <img 
            src={PetrobrasLogo} 
            alt="Logo Petrobras" 
            className="menu-logo"
          />
        </NavLink>
      </div>
      
      <ul className="menu-items">
        <li className="menu-item">
          <NavLink 
            to="/uf" 
            className={({ isActive }) => 
              `menu-link ${isActive ? 'active' : ''}`
            }
          >
            UFs
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink 
            to="/municipios" 
            className={({ isActive }) => 
              `menu-link ${isActive ? 'active' : ''}`
            }
          >
            Municípios
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink 
            to="/bairros" 
            className={({ isActive }) => 
              `menu-link ${isActive ? 'active' : ''}`
            }
          >
            Bairros
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink 
            to="/comunidades" 
            className={({ isActive }) => 
              `menu-link ${isActive ? 'active' : ''}`
            }
          >
            Comunidades
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink 
            to="/indicadores" 
            className={({ isActive }) => 
              `menu-link ${isActive ? 'active' : ''}`
            }
          >
            Indicadores
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink 
            to="/relatorios" 
            className={({ isActive }) => 
              `menu-link ${isActive ? 'active' : ''}`
            }
          >
            Relatórios
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;