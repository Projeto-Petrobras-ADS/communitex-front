import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu/Menu';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import CadastroIndicadores from './pages/Indicadores/CadastrosIndicadores';
import ListarIndicadoresPage from './pages/Indicadores/ListarIndicadoresPage';
import CadastroComunidadePage from './pages/Communidade/CadastroComunidadePage';
import ListarComunidadePage from './pages/Communidade/ListarComunidadePage';
import ListarBairroPage from './pages/Bairro/ListarBairroPage';
import CadastroBairroPage from './pages/Bairro/CadastroBairroPage';
import ListarUFPage from './pages/UF/ListarUFPage';
import CadastroUFPage from './pages/UF/CadastroUFPage';
import ListarMunicipioPage from './pages/Municipio/ListarMunicipioPage';
import CadastroMunicipioPage from './pages/Municipio/CadastroMunicipioPage';
import SocioeconomicCharts from './components/Grafico/SocioeconomicCharts';
import Mapa from './pages/Mapa/Mapa';
import LoginPage from './pages/Login/LoginPage';
import PontoDeInterrese from './pages/PontoDeInterrese/PontoDeInterrese';

function App() {

  return (
      <Router>
          <div className="app-container">
              <Menu />
              <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/indicadores" element={<ListarIndicadoresPage />} />
                  <Route path="/indicadores/cadastro" element={<CadastroIndicadores />} />
                  <Route path="/indicadores/cadastro/:id" element={<CadastroIndicadores />} />
                  <Route path="/comunidades" element={<ListarComunidadePage />} />
                  <Route path="/comunidades/cadastro" element={<CadastroComunidadePage />} />
                  <Route path="/comunidades/cadastro/:id" element={<CadastroComunidadePage />} />
                  <Route path="/bairros" element={<ListarBairroPage />} />
                  <Route path="/bairros/cadastro" element={<CadastroBairroPage />} />
                  <Route path="/bairros/cadastro/:id" element={<CadastroBairroPage />} />
                  <Route path="bairros/cadastroPontoInterrese/:id" element={<PontoDeInterrese/>} />
                  <Route path="/uf" element={<ListarUFPage />} />
                  <Route path="/uf/cadastro" element={<CadastroUFPage />} />
                  <Route path="/uf/cadastro/:id" element={<CadastroUFPage />} />
                  <Route path="/municipios" element={<ListarMunicipioPage />} />
                  <Route path="/municipios/cadastro" element={<CadastroMunicipioPage />} />
                  <Route path="/municipios/cadastro/:id" element={<CadastroMunicipioPage />} />
                  <Route path="/relatorios" element={<SocioeconomicCharts/>} />
                  <Route path='/maps' element={<Mapa/>}/>
              </Routes>
              <Footer />
          </div>
      </Router>
  )
}

export default App
