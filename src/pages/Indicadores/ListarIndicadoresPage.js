import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Listagem from '../../components/Listagem/Listagem';
import localStorageService from '../../services/localStorageService';
import './ListarIndicadoresPage.css';

const ListarIndicadoresPage = () => {
  const [indicadores, setIndicadores] = useState([]);
  const [comunidades, setComunidades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = () => {
      const loadedIndicadores = localStorageService.getItems('indicadores');
      const loadedComunidades = localStorageService.getItems('comunidades');
      setIndicadores(loadedIndicadores);
      setComunidades(loadedComunidades);
    };
    loadData();
  }, []);

  const columns = [
    {
      key: 'comunidadeId',
      title: 'Comunidade',
      sortable: true,
      render: (value) => {
        const comunidade = comunidades.find(c => c.id === value);
        return comunidade ? comunidade.nome : '-';
      }
    },
    {
      key: 'ano',
      title: 'Ano',
      sortable: true
    },
    {
      key: 'idh',
      title: 'IDH',
      sortable: true,
      render: (value) => value !== undefined && value !== null ? value.toFixed(3) : '-'
    },
    {
      key: 'rendaMedia',
      title: 'Renda Média (R$)',
      sortable: true,
      render: (value) => value !== undefined && value !== null ? `R$ ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'
    },
    {
      key: 'escolaridadeMedia',
      title: 'Escolaridade Média (%)',
      sortable: true,
      render: (value) => value !== undefined && value !== null ? `${value}%` : '-'
    },
    {
      key: 'taxaDesemprego',
      title: 'Desemprego (%)',
      sortable: true,
      render: (value) => value !== undefined && value !== null ? `${value}%` : '-'
    },
    {
      key: 'observacoes',
      title: 'Observações',
      sortable: false,
      render: (value) => value || '-'
    }
  ];

  const handleAddNew = () => {
    navigate('/indicadores/cadastro');
  };

  const handleEdit = (indicador) => {
    navigate(`/indicadores/cadastro/${indicador.id}`);
  };

  const handleDelete = (indicador) => {
    const comunidade = comunidades.find(c => c.id === indicador.comunidadeId);
    if (window.confirm(`Deseja excluir o indicador da comunidade ${comunidade ? comunidade.nome : ''} (${indicador.ano})?`)) {
      localStorageService.deleteItem('indicadores', indicador.id);
      setIndicadores(localStorageService.getItems('indicadores'));
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const filteredIndicadores = indicadores.filter(indicador => {
    if (!searchTerm) return true;
    const comunidadeNome = comunidades.find(c => c.id === indicador.comunidadeId)?.nome.toLowerCase() || '';
    const observacoes = indicador.observacoes?.toLowerCase() || '';
    return (
      comunidadeNome.includes(searchTerm) ||
      indicador.ano?.toString().includes(searchTerm) ||
      (indicador.idh && indicador.idh.toString().includes(searchTerm)) ||
      (indicador.rendaMedia && indicador.rendaMedia.toString().includes(searchTerm)) ||
      (indicador.escolaridadeMedia && indicador.escolaridadeMedia.toString().includes(searchTerm)) ||
      (indicador.taxaDesemprego && indicador.taxaDesemprego.toString().includes(searchTerm)) ||
      observacoes.includes(searchTerm)
    );
  });

  return (
    <Listagem
      title="Indicadores Socioeconômicos"
      subtitle="Gerencie o cadastro de indicadores das comunidades"
      buttonAddNewTile="Novo Indicador"
      handleAddNew={handleAddNew}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onSearch={handleSearch}
      columns={columns}
      data={filteredIndicadores}
      enablePagination={true}
      itemsPerPage={10}
    />
  );
};

export default ListarIndicadoresPage;