import './Header.css';
import logoPetrobras from '../../asserts/logo/logo.png';

const Header = () => {
  return (
    <header className="petrobras-header">
      <div className="header-container">
        <div className="logo">
          <img src={logoPetrobras} alt="Logo da Petrobras" />
        </div>
        <nav className="navigation">
          <ul>
            <li><a href="/">Início</a></li>
            <li><a href="/sobre">Sobre</a></li>
            <li><a href="/produtos">Produtos</a></li>
            <li><a href="/contato">Contato</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default Header;