import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Listagem from '../../components/Listagem/Listagem';
import localStorageService from '../../services/localStorageService';
import './ListarBairroPage.css';

const ListarBairroPage = () => {
  const [bairros, setBairros] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Carregar dados do localStorage
  useEffect(() => {
    const loadData = () => {
      const loadedBairros = localStorageService.getItems('bairros');
      const loadedMunicipios = localStorageService.getItems('municipios');
      setBairros(loadedBairros);
      setMunicipios(loadedMunicipios);
    };

    loadData();
  }, []);

  // Configuração das colunas da tabela
  const columns = [
    {
      key: 'nome',
      title: 'Nome do Bairro',
      sortable: true
    },
    {
      key: 'municipioId',
      title: 'Município',
      sortable: true,
      render: (value) => {
        const municipio = municipios.find(m => m.id === value);
        return municipio ? municipio.nome : '-';
      }
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
      key: 'regiao',
      title: 'Região',
      sortable: true
    }
  ];

  const handleAddNew = () => {
    navigate('/bairros/cadastro');
  };

  const handleEdit = (bairro) => {
    navigate(`/bairros/cadastro/${bairro.id}`);
  };
  
 const handlePointInterest = (bairro) => {
  navigate(`/bairros/cadastroPontoInterrese/${bairro.id}`);
  };
  const handleDelete = (bairro) => {
    if (window.confirm(`Deseja excluir o bairro ${bairro.nome}?`)) {
      localStorageService.deleteItem('bairros', bairro.id);
      setBairros(localStorageService.getItems('bairros'));
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  // Filtra os bairros baseado no termo de pesquisa
  const filteredBairros = bairros.filter(bairro => {
    if (!searchTerm) return true;

    const municipioNome = municipios.find(m => m.id === bairro.municipioId)?.nome.toLowerCase() || '';

    return (
      bairro.nome?.toLowerCase().includes(searchTerm) ||
      municipioNome.includes(searchTerm) ||
      bairro.regiao?.toLowerCase().includes(searchTerm) ||
      bairro.populacao?.toString().includes(searchTerm) ||
      bairro.area?.toString().includes(searchTerm)
    );
  });

  return (
    <Listagem
      title="Bairros"
      subtitle="Gerencie o cadastro de bairros"
      buttonAddNewTile="Novo Bairro"
      handleAddNew={handleAddNew}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onPointInterest={handlePointInterest}
      onSearch={handleSearch}
      columns={columns}
      data={filteredBairros}
      enablePagination={true}
      itemsPerPage={10}
    />
  );
};

export default ListarBairroPage;
