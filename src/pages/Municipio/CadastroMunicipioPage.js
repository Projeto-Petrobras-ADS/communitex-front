import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '../../components/Form/Form';
import Cadastro from '../../components/Cadastro/Cadastro';
import localStorageService from '../../services/localStorageService';
import './CadastroMunicipioPage.css';

const CadastroMunicipioPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ufs, setUfs] = useState([]);

  useEffect(() => {
    // Load UFs for the dropdown
    const loadUfs = () => {
      const data = localStorageService.getItems('ufs');
      setUfs(data);
    };
    loadUfs();
  }, []);

  const handleSubmit = (formData) => {
    localStorageService.saveItem('municipios', formData);
    navigate('/municipios');
  };

  const handleCancel = () => {
    navigate('/municipios');
  };

  const getInitialData = () => {
    if (id) {
      return localStorageService.getItemById('municipios', id);
    }
    return {
      nome: '',
      uf: ''
    };
  };

  const formFields = [
    {
      name: 'nome',
      label: 'Nome do Município',
      type: 'text',
      required: true,
      maxLength: 100,
      placeholder: 'Digite o nome do município'
    },
    {
      name: 'uf',
      label: 'UF',
      type: 'select',
      required: true,
      options: ufs.map(uf => ({
        value: uf.sigla,
        label: `${uf.sigla} - ${uf.nome}`
      })),
      placeholder: 'Selecione a UF'
    }
  ];

  return (
    <Cadastro
      formFields={formFields}
      id={id}
      title="Município"
      initialData={getInitialData()}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default CadastroMunicipioPage;
