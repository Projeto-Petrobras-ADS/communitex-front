import { useState, useEffect } from 'react';
import Cadastro from '../../components/Cadastro/Cadastro';
import { useNavigate, useParams } from 'react-router-dom';
import localStorageService from '../../services/localStorageService';
import './PontoDeInterrese.css';

const camposPorTipo = {
  'hospital': [
    {
      name: 'nome',
      label: 'Nome do Hospital',
      type: 'text',
      placeholder: 'Digite o nome do hospital',
      required: true,
    },
    {
      name: 'especialidade',
      label: 'Especialidade',
      type: 'text',
      placeholder: 'Digite a especialidade (ex: Cardiologia)',
      required: true,
    },
    {
      name: 'telefone',
      label: 'Telefone',
      type: 'tel',
      placeholder: '(xx) xxxx-xxxx',
      required: true,
    },
  ],
  'clinica-odontologica': [
    {
      name: 'nome',
      label: 'Nome da Clínica Odontológica',
      type: 'text',
      placeholder: 'Digite o nome da clínica odontológica',
      required: true,
    },
    {
      name: 'especialidade',
      label: 'Especialidade',
      type: 'text',
      placeholder: 'Digite a especialidade (ex: Ortodontia)',
      required: true,
    },
    {
      name: 'telefone',
      label: 'Telefone',
      type: 'tel',
      placeholder: '(xx) xxxx-xxxx',
      required: true,
    },
  ],
  'policia': [
    {
      name: 'nome',
      label: 'Nome do Posto Policial',
      type: 'text',
      placeholder: 'Digite o nome do posto policial',
      required: true,
    },
    {
      name: 'telefone',
      label: 'Telefone',
      type: 'tel',
      placeholder: '(xx) xxxx-xxxx',
      required: true,
    },
  ]
};

const selectField = (selectedTipo, handler) => ({
  name: 'ponto_interesse',
  label: 'Ponto de Interesse',
  type: 'select',
  value: selectedTipo,
  onChange: handler,
  options: [
    { value: 'hospital', label: 'Hospital' },
    { value: 'clinica-odontologica', label: 'Clínica Odontológica' },
    { value: 'policia', label: 'Posto Policial' },
  ]
});

function PontoDeInteresse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState('');
  const [formFields, setFormFields] = useState([selectField('', handlerInteresse)]);

  function handlerInteresse(event) {
    const selectedValue = event.target.value;
    setSelectedTipo(selectedValue);
  }

  useEffect(() => {
    setFormFields([
      selectField(selectedTipo, handlerInteresse),
      ...(camposPorTipo[selectedTipo] || [])
    ]);
  }, [selectedTipo]);

  const handleSubmit = (formData) => {
    try {
      const pontoData = {
        ...formData,
        bairroId: id
      };
      localStorageService.saveItem('pontosDeInteresse', pontoData);
      alert(id ? 'Ponto de Interesse atualizado com sucesso!' : 'Ponto de Interesse cadastrado com sucesso!');
      navigate(-1);
    } catch (error) {
      alert('Erro ao salvar Ponto de Interesse: ' + error.message);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Cadastro
      formFields={formFields}
      title="Ponto de Interesse"
      initialData={initialData || {}}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

export default PontoDeInteresse;