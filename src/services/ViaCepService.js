import axios from 'axios';
import { onlyDigits } from '../utils/masks';

const viaCepApi = axios.create({
  baseURL: 'https://viacep.com.br/ws',
  timeout: 8000,
});

const ViaCepService = {
  buscarCep: async (cep) => {
    const digits = onlyDigits(cep);
    if (digits.length !== 8) throw new Error('Informe um CEP válido com 8 dígitos.');

    const response = await viaCepApi.get(`/${digits}/json/`);
    if (response.data?.erro) throw new Error('CEP não encontrado.');

    return response.data;
  },
};

export default ViaCepService;

