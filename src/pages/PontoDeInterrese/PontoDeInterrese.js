import React, { useState, useEffect } from 'react';
import './PontoDeInterrese.css';

function PontoDeInteresse() {
  const [formData, setFormData] = useState({
    tipo: '',
    nome: '',
    endereco: '',
    telefoneContato: '',
    // Campos genéricos ou que aparecerão em mais de um tipo
    horarioFuncionamento: '', // Usado em Hospital, Coleta de Lixo, Escola, Ponto de Ônibus, Posto de Saúde
    
    // Campos específicos de Escola
    capacidadeAlunos: '',

    // Campos para Hospital (Leitos, Horário de Funcionamento)
    leitos: '', 

    // Campos para Posto de Saúde, Clínica Médica, Clínica Odontológica, Clínica Oftalmológica
    especialidades: '', 
    numProfissionais: '',
    equipamentos: ''
  });

  const [pontosDeInteresseCadastrados, setPontosDeInteresseCadastrados] = useState([]);

  useEffect(() => {
    const loadedPontos = JSON.parse(localStorage.getItem('pontosDeInteresse')) || [];
    setPontosDeInteresseCadastrados(loadedPontos);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isDuplicate = pontosDeInteresseCadastrados.some(ponto => 
      ponto.nome.toLowerCase() === formData.nome.toLowerCase() && 
      ponto.endereco.toLowerCase() === formData.endereco.toLowerCase()
    );

    if (isDuplicate) {
      alert('Erro: Este ponto de interesse (nome e endereço) já foi cadastrado!');
      return;
    }

    const newId = Date.now().toString();
    const novoPonto = { ...formData, id: newId };

    const updatedPontos = [...pontosDeInteresseCadastrados, novoPonto];
    setPontosDeInteresseCadastrados(updatedPontos);
    localStorage.setItem('pontosDeInteresse', JSON.stringify(updatedPontos));

    alert('Ponto de interesse cadastrado com sucesso!');

    // Limpar o formulário
    setFormData({
      tipo: '',
      nome: '',
      endereco: '',
      telefoneContato: '',
      horarioFuncionamento: '',
      capacidadeAlunos: '',
      leitos: '',
      especialidades: '',
      numProfissionais: '',
      equipamentos: ''
    });
  };

  return (
    <div className="container">
      <h1>Cadastro de Ponto de Interesse</h1>
      <p className="description">
        Cadastre o ponto de interesse no seu bairro como hospitais ou posto de saúde, 
        ponto de ônibus, escolas, coleta de lixo, posto da polícia e etc.
      </p>
      
      <form onSubmit={handleSubmit} className="form">
        {/* Tipo de Ponto de Interesse - agora é o primeiro */}
        <div className="form-group">
          <label htmlFor="tipo">Tipo de Ponto de Interesse:</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Selecione...</option>
            <option value="hospital">Hospital</option>
            <option value="posto-saude">Posto de Saúde</option>
            <option value="clinica-medica">Clínica Médica</option>
            <option value="clinica-odontologica">Clínica Odontológica</option>
            <option value="clinica-oftalmologica">Clínica Oftalmológica</option>
            <option value="escola">Escola</option>
            <option value="onibus">Ponto de Ônibus</option>
            <option value="lixo">Coleta de Lixo</option>
            <option value="policia">Posto Policial</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="endereco">Endereço:</label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campo de Telefone de Contato - Sempre visível */}
        <div className="form-group">
          <label htmlFor="telefoneContato">Telefone de Contato:</label>
          <input
            type="tel" 
            id="telefoneContato"
            name="telefoneContato"
            value={formData.telefoneContato}
            onChange={handleChange}
            placeholder="(XX) XXXXX-XXXX"
          />
        </div>
        
        {/* Horário de Funcionamento - Para Hospital, Posto de Saúde, Escola, Ponto de Ônibus, Coleta de Lixo */}
        {(formData.tipo === 'hospital' || 
          formData.tipo === 'lixo' || 
          formData.tipo === 'escola' || 
          formData.tipo === 'onibus' || 
          formData.tipo === 'posto-saude') && (
          <div className="form-group">
            <label htmlFor="horarioFuncionamento">Horário de Funcionamento:</label>
            <input
              type="text"
              id="horarioFuncionamento"
              name="horarioFuncionamento"
              value={formData.horarioFuncionamento}
              onChange={handleChange}
              placeholder="Ex: Seg-Sex, 08:00-17:00"
            />
          </div>
        )}

        {/* Campos específicos para Escola */}
        {formData.tipo === 'escola' && (
          <div className="form-group">
            <label htmlFor="capacidadeAlunos">Capacidade de Número de Alunos:</label>
            <input
              type="number"
              id="capacidadeAlunos"
              name="capacidadeAlunos"
              value={formData.capacidadeAlunos}
              onChange={handleChange}
            />
          </div>
        )}

        {/* Campos específicos para Hospital */}
        {formData.tipo === 'hospital' && (
          <div className="form-group">
            <label htmlFor="leitos">Número de Leitos:</label>
            <input
              type="number"
              id="leitos"
              name="leitos"
              value={formData.leitos}
              onChange={handleChange}
            />
          </div>
        )}
        
        {/* Campos específicos para Posto de Saúde e as Novas Clínicas */}
        {(formData.tipo === 'posto-saude' || 
          formData.tipo === 'clinica-medica' || 
          formData.tipo === 'clinica-odontologica' || 
          formData.tipo === 'clinica-oftalmologica') && (
          <>
            <div className="form-group">
              <label htmlFor="especialidades">Especialidades Disponíveis:</label>
              <input
                type="text"
                id="especialidades"
                name="especialidades"
                value={formData.especialidades}
                onChange={handleChange}
                placeholder="Separe por vírgulas"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="numProfissionais">Número de Profissionais:</label>
              <input
                type="number"
                id="numProfissionais"
                name="numProfissionais"
                value={formData.numProfissionais}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="equipamentos">Equipamentos Disponíveis:</label>
              <textarea
                id="equipamentos"
                name="equipamentos"
                value={formData.equipamentos}
                onChange={handleChange}
                placeholder="Liste os equipamentos disponíveis"
              />
            </div>
          </>
        )}
        
        <button type="submit" className="submit-btn">Cadastrar</button>
      </form>
    </div>
  );
}

export default PontoDeInteresse;