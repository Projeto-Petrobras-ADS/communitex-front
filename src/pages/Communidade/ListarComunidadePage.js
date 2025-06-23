import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import Listagem from '../../components/Listagem/Listagem';
import localStorageService from '../../services/localStorageService';
import './ListarComunidadePage.css';

const ListarComunidadePage = () => {
  const [comunidades, setComunidades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Carregar dados do localStorage
  useEffect(() => {
    const loadData = () => {
      const loadedComunidades = localStorageService.getItems('comunidades');
      setComunidades(loadedComunidades);
    };

    loadData();
  }, []);

  // Configuração das colunas da tabela
  const columns = [
    {
      key: 'nome',
      title: 'Nome da Comunidade',
      sortable: true
    },
    {
      key: 'populacao',
      title: 'População',
      sortable: true,
      render: (value) => value ? value.toLocaleString() : '-'
    },
    {
      key: 'area',
      title: 'Área (km²)',
      sortable: true,
      render: (value) => value ? `${value.toFixed(2)} km²` : '-'
    },
    {
      key: 'bairro',
      title: 'Bairro',
      sortable: true,
      render: (value) => value || '-'
    },
    {
      key: 'municipio',
      title: 'Município',
      sortable: true,
      render: (value) => value || '-'
    },
    {
      key: 'uf',
      title: 'UF',
      sortable: true,
      render: (value) => value || '-'
    }
  ];

  const handleAddNew = () => {
    navigate('/comunidades/cadastro');
  };

  const handleEdit = (comunidade) => {
    navigate(`/comunidades/cadastro/${comunidade.id}`);
  };

  const handleDelete = (comunidade) => {
    if (window.confirm(`Deseja excluir a comunidade ${comunidade.nome}?`)) {
      localStorageService.deleteItem('comunidades', comunidade.id);
      setComunidades(localStorageService.getItems('comunidades'));
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const handleLocation = (comunidade) => {
    // Pega nome do bairro e município
    const bairro = comunidade.bairro;
    const municipio = comunidade.municipio;
    // Redireciona para /maps com query params
    navigate(`/maps?bairro=${encodeURIComponent(bairro)}&municipio=${encodeURIComponent(municipio)}`);
  };

  // Filtra as comunidades baseado no termo de pesquisa
  const filteredComunidades = comunidades.filter(comunidade => {
    if (!searchTerm) return true;

    return (
      comunidade.nome?.toLowerCase().includes(searchTerm) ||
      comunidade.bairro?.toLowerCase().includes(searchTerm) ||
      comunidade.municipio?.toLowerCase().includes(searchTerm) ||
      comunidade.uf?.toLowerCase().includes(searchTerm) ||
      comunidade.populacao?.toString().includes(searchTerm) ||
      comunidade.area?.toString().includes(searchTerm)
    );
  });

  return (
    <Listagem
      title="Comunidades"
      subtitle="Gerencie o cadastro de comunidades"
      buttonAddNewTile="Nova Comunidade"
      handleAddNew={handleAddNew}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onSearch={handleSearch}
      onLocation={handleLocation}
      columns={columns}
      data={filteredComunidades}
      enablePagination={true}
      itemsPerPage={10}
    />
  );
};

export default ListarComunidadePage;
