import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '../../components/Form/Form';
import Cadastro from '../../components/Cadastro/Cadastro';
import localStorageService from '../../services/localStorageService';
import './CadastroIndicadores.css';

const CadastroIndicadores = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comunidades, setComunidades] = useState([]);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    // Carregar lista de comunidades
    setComunidades(localStorageService.getItems('comunidades'));
    // Carregar dados iniciais se estiver editando
    if (id) {
      const indicador = localStorageService.getItemById('indicadores', id);
      if (indicador) {
        setInitialData(indicador);
      }
    }
  }, [id]);

  const formFields = [
    {
      name: 'comunidadeId',
      label: 'Comunidade',
      type: 'select',
      required: true,
      options: comunidades.map(c => ({ value: c.id, label: c.nome }))
    },
    {
      name: 'ano',
      label: 'Ano',
      type: 'number',
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
      defaultValue: new Date().getFullYear()
    },
    {
      name: 'idh',
      label: 'IDH',
      type: 'number',
      min: 0,
      max: 1,
      step: 0.001,
      placeholder: 'Ex: 0.750'
    },
    {
      name: 'rendaMedia',
      label: 'Renda Média (R$)',
      type: 'number',
      min: 0,
      step: 0.01,
      placeholder: 'Ex: 2500.00'
    },
    {
      name: 'escolaridadeMedia',
      label: 'Escolaridade Média (%)',
      type: 'number',
      min: 0,
      max: 100,
      step: 0.1,
      placeholder: 'Ex: 85.0'
    },
    {
      name: 'taxaDesemprego',
      label: 'Taxa de Desemprego (%)',
      type: 'number',
      min: 0,
      max: 100,
      step: 0.1,
      placeholder: 'Ex: 7.5'
    },
    {
      name: 'observacoes',
      label: 'Observações',
      type: 'textarea',
      rows: 4,
      placeholder: 'Adicione observações relevantes sobre os indicadores'
    }
  ];

  const handleSubmit = (formData) => {
    try {
      // Converter valores para número quando necessário
      const indicadorData = {
        ...formData,
        idh: formData.idh ? parseFloat(formData.idh) : null,
        rendaMedia: formData.rendaMedia ? parseFloat(formData.rendaMedia) : null,
        escolaridadeMedia: formData.escolaridadeMedia ? parseFloat(formData.escolaridadeMedia) : null,
        taxaDesemprego: formData.taxaDesemprego ? parseFloat(formData.taxaDesemprego) : null
      };
      localStorageService.saveItem('indicadores', indicadorData);
      alert(id ? 'Indicador atualizado com sucesso!' : 'Indicador cadastrado com sucesso!');
      navigate('/indicadores');
    } catch (error) {
      alert('Erro ao salvar indicador: ' + error.message);
    }
  };

  const handleCancel = () => {
    navigate('/indicadores');
  };

  if (id && !initialData) {
    return <div>Carregando...</div>;
  }

  return (
    <Cadastro
      formFields={formFields}
      id={id}
      title="Indicadores Socioeconômicos"
      initialData={initialData || { ano: new Date().getFullYear() }}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default CadastroIndicadores;