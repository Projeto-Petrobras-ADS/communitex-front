import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cadastro from '../../components/Cadastro/Cadastro';
import localStorageService from '../../services/localStorageService';
import './CadastroBairroPage.css';

const CadastroBairroPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    if (id) {
      const bairro = localStorageService.getItemById('bairros', id);
      if (bairro) {
        setInitialData(bairro);
      }
    }

    const loadedMunicipios = localStorageService.getItems('municipios');
    setMunicipios(loadedMunicipios);
  }, [id]);

  const formFields = [
    {
      name: 'nome',
      label: 'Nome do Bairro',
      type: 'text',
      required: true,
      placeholder: 'Digite o nome do bairro'
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
      name: 'regiao',
      label: 'Região',
      type: 'text',
      placeholder: 'Digite a região do bairro'
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea',
      rows: 4,
      placeholder: 'Descreva características relevantes do bairro'
    }
  ];

  const handleSubmit = (formData) => {
    try {
      const bairroData = {
        ...formData,
        populacao: formData.populacao ? parseInt(formData.populacao) : null,
        area: formData.area ? parseFloat(formData.area) : null
      };

      const municipio = municipios.find(m => m.id === formData.municipioId);
      if (municipio) {
        bairroData.municipio = municipio.nome;
        bairroData.uf = municipio.uf;
      }

      localStorageService.saveItem('bairros', bairroData);
      alert(id ? 'Bairro atualizado com sucesso!' : 'Bairro cadastrado com sucesso!');
      navigate('/bairros');
    } catch (error) {
      alert('Erro ao salvar bairro: ' + error.message);
    }
  };

  const handleCancel = () => {
    navigate('/bairros');
  };

  if (id && !initialData) {
    return <div>Carregando...</div>;
  }

  return (
    <Cadastro
      formFields={formFields}
      id={id}
      title="Bairro"
      initialData={initialData || {}}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default CadastroBairroPage;
