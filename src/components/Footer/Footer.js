import React from 'react';
import './Footer.css';
import PetrobrasLogo from '../../assets/logo/logo.png';

const Footer = () => {
  return (
    <footer className="petrobras-footer">
      <div className="footer-container">
        <div className="footer-logo-section">
          <img 
            src={PetrobrasLogo} 
            alt="Petrobras" 
            className="footer-logo"
          />
          <p className="footer-slogan">Energia que transforma</p>
        </div>

        <div className="footer-links-section">
          <div className="footer-links-column">
            <h4 className="footer-title">Navegação</h4>
            <ul className="footer-links">
              <li><a href="/uf">UFs</a></li>
              <li><a href="/municipios">Municípios</a></li>
              <li><a href="/bairros">Bairros</a></li>
            </ul>
          </div>

          <div className="footer-links-column">
            <h4 className="footer-title">Recursos</h4>
            <ul className="footer-links">
              <li><a href="/comunidades">Comunidades</a></li>
              <li><a href="/indicadores">Indicadores</a></li>
              <li><a href="/ajuda">Ajuda</a></li>
              <li><a href="/documentacao">Documentação</a></li>
            </ul>
          </div>

          <div className="footer-links-column">
            <h4 className="footer-title">Institucional</h4>
            <ul className="footer-links">
              <li><a href="/">Sobre o Sistema</a></li>
              <li><a href="/privacidade">Política de Privacidade</a></li>
              <li><a href="/termos">Termos de Uso</a></li>
              <li><a href="/contato">Contato</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-social-section">
          <div className="social-icons">
            <a href="https://facebook.com/petrobras" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com/petrobras" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://linkedin.com/company/petrobras" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://instagram.com/petrobras" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Petrobras - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;