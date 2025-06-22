import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cadastro from '../../components/Cadastro/Cadastro';
import localStorageService from '../../services/localStorageService';
import './CadastroUFPage.css';

const CadastroUFPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    // Carregar dados iniciais se estiver editando
    if (id) {
      const uf = localStorageService.getItemById('ufs', id);
      if (uf) {
        setInitialData(uf);
      }
    }
  }, [id]);

  const formFields = [
    {
      name: 'sigla',
      label: 'Sigla',
      type: 'text',
      required: true,
      maxLength: 2,
      placeholder: 'Ex: SP',
      // Converter para maiúsculo
      transform: value => value.toUpperCase()
    },
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true,
      placeholder: 'Digite o nome da UF'
    },
    {
      name: 'regiao',
      label: 'Região',
      type: 'select',
      required: true,
      options: [
        { value: 'Norte', label: 'Norte' },
        { value: 'Nordeste', label: 'Nordeste' },
        { value: 'Centro-Oeste', label: 'Centro-Oeste' },
        { value: 'Sudeste', label: 'Sudeste' },
        { value: 'Sul', label: 'Sul' }
      ]
    },
    {
      name: 'populacao',
      label: 'População',
      type: 'number',
      min: 0,
      placeholder: 'Digite a população estimada'
    },
    {
      name: 'area',
      label: 'Área (km²)',
      type: 'number',
      min: 0,
      step: '0.01',
      placeholder: 'Digite a área em km²'
    },
    {
      name: 'pib',
      label: 'PIB (R$)',
      type: 'number',
      min: 0,
      step: '0.01',
      placeholder: 'Digite o PIB'
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea',
      rows: 4,
      placeholder: 'Descreva características relevantes da UF'
    }
  ];

  const handleSubmit = (formData) => {
    try {
      // Converter valores numéricos
      const ufData = {
        ...formData,
        sigla: formData.sigla.toUpperCase(),
        populacao: formData.populacao ? parseInt(formData.populacao) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        pib: formData.pib ? parseFloat(formData.pib) : null
      };

      localStorageService.saveItem('ufs', ufData);
      alert(id ? 'UF atualizada com sucesso!' : 'UF cadastrada com sucesso!');
      navigate('/uf');
    } catch (error) {
      alert('Erro ao salvar UF: ' + error.message);
    }
  };

  const handleCancel = () => {
    navigate('/uf');
  };

  if (id && !initialData) {
    return <div>Carregando...</div>;
  }

  return (
    <Cadastro
      formFields={formFields}
      id={id}
      title="Unidade Federativa"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default CadastroUFPage;
