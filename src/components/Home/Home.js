import { useNavigate } from 'react-router-dom';
import './Home.css';
import PetrobrasLogo from '../../assets/logo/logo.png';
import SystemImage from '../../assets/logo/logo.png';
import Button from '../Button/Button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <img src={PetrobrasLogo} alt="Petrobras" className="home-logo" />
        <h1 className="home-title">Sistema de Gestão Territorial</h1>
        <h3 className="home-subtitle">Communitex</h3>
        <p className="home-subtitle">
          Ferramenta integrada para mapeamento e análise de dados socioeconômicos
        </p>
      </header>

      <main className="home-content">
        <section className="home-about">
          <div className="about-text">
            <h2>Sobre o Projeto</h2>
            <p>
              Este sistema foi desenvolvido para auxiliar a Petrobras no mapeamento e gestão
              de informações territoriais, proporcionando uma visão integrada das comunidades
              e regiões onde a empresa atua.
            </p>
            <p>
              Com recursos completos de cadastro para unidades territoriais e indicadores
              socioeconômicos, a plataforma permite o acompanhamento detalhado necessário
              para tomadas de decisão estratégicas.
            </p>
          </div>
          <div className="about-image">
            <img src={SystemImage} alt="Ilustração do sistema" />
          </div>
        </section>

        <section className="home-features">
          <h2>Principais Funcionalidades</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Gestão Territorial</h3>
              <p>
                Cadastro completo de UFs, municípios, bairros, logradouros e comunidades
                com relacionamento hierárquico.
              </p>
            </div>
            <div className="feature-card">
              <h3>Indicadores Socioeconômicos</h3>
              <p>
                Armazenamento e análise de dados demográficos, econômicos e sociais para
                embasar projetos de responsabilidade social.
              </p>
            </div>
            <div className="feature-card">
              <h3>Relacionamento de Dados</h3>
              <p>
                Visualização integrada das informações com cruzamento de dados territoriais
                e indicadores.
              </p>
            </div>
          </div>
        </section>

        <section className="home-cta">
          <h2>Comece a explorar o sistema</h2>
          <p>
            Acesse os módulos disponíveis para cadastrar e consultar informações:
          </p>
          <div className="cta-buttons">
            <Button variant="primary" onClick={() => navigate('/uf')}>Módulo Territorial</Button>
            <Button variant="secondary" onClick={() => navigate('/indicadores')}>Indicadores</Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;