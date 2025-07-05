import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cadastro from '../../components/Cadastro/Cadastro';
import localStorageService from '../../services/localStorageService';
import './CadastroComunidadePage.css';

const CadastroComunidadePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [municipios, setMunicipios] = useState([]);
  const [bairros, setBairros] = useState([]);

  useEffect(() => {
    if (id) {
      const comunidade = localStorageService.getItemById('comunidades', id);
      if (comunidade) {
        setInitialData(comunidade);
      }
    }

    const loadedMunicipios = localStorageService.getItems('municipios');
    const loadedBairros = localStorageService.getItems('bairros');
    setMunicipios(loadedMunicipios);
    setBairros(loadedBairros);
  }, [id]);

  const formFields = [
    {
      name: 'nome',
      label: 'Nome da Comunidade',
      type: 'text',
      required: true,
      placeholder: 'Digite o nome da comunidade'
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
      name: 'bairroId',
      label: 'Bairro',
      type: 'select',
      required: true,
      options: bairros.map(b => ({
        value: b.id,
        label: b.nome
      }))
    },
    {
      name: 'municipioId',
      label: 'Município',
      type: 'select',
      required: true,
      options: municipios.map(m => ({
        value: m.id,
        label: m.nome
      }))
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea',
      rows: 4,
      placeholder: 'Descreva características relevantes da comunidade'
    }
  ];

  const handleSubmit = (formData) => {
    try {
      const comunidadeData = {
        ...formData,
        populacao: formData.populacao ? parseInt(formData.populacao) : null,
        area: formData.area ? parseFloat(formData.area) : null
      };

      const bairro = bairros.find(b => b.id === formData.bairroId);
      const municipio = municipios.find(m => m.id === formData.municipioId);

      comunidadeData.bairro = bairro?.nome;
      comunidadeData.municipio = municipio?.nome;
      comunidadeData.uf = municipio?.uf;

      localStorageService.saveItem('comunidades', comunidadeData);
      alert(id ? 'Comunidade atualizada com sucesso!' : 'Comunidade cadastrada com sucesso!');
      navigate('/comunidades');
    } catch (error) {
      alert('Erro ao salvar comunidade: ' + error.message);
    }
  };

  const handleCancel = () => {
    navigate('/comunidades');
  };

  if (id && !initialData) {
    return <div>Carregando...</div>;
  }

  return (
    <Cadastro
      formFields={formFields}
      id={id}
      title="Comunidade"
      initialData={initialData || {}}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default CadastroComunidadePage;