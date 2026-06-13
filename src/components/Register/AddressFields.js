import React, { useState } from 'react';
import {
  Alert,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { Home as HomeIcon, Search as SearchIcon } from '@mui/icons-material';
import ViaCepService from '../../services/ViaCepService';
import { maskCep, onlyDigits } from '../../utils/masks';

const AddressFields = ({ values, errors, touched, handleBlur, setFieldValue, inputSx = {} }) => {
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');

  const buscarCep = async (cep) => {
    if (onlyDigits(cep).length !== 8) return;
    setLoadingCep(true);
    setCepError('');
    try {
      const data = await ViaCepService.buscarCep(cep);
      setFieldValue('logradouro', data.logradouro || '');
      setFieldValue('bairro', data.bairro || '');
      setFieldValue('cidade', data.localidade || '');
      setFieldValue('estado', data.uf || '');
      window.setTimeout(() => document.querySelector('[name="numero"]')?.focus(), 0);
    } catch (error) {
      setCepError(error.message || 'Não foi possível consultar o CEP.');
    } finally {
      setLoadingCep(false);
    }
  };

  const fieldProps = (name) => ({
    name,
    value: values[name],
    onBlur: handleBlur,
    error: touched[name] && Boolean(errors[name]),
    helperText: touched[name] && errors[name],
    onChange: (event) => setFieldValue(name, event.target.value),
    sx: inputSx,
  });

  return (
    <Stack spacing={2}>
      {cepError && <Alert severity="warning" onClose={() => setCepError('')}>{cepError} Você pode preencher o endereço manualmente.</Alert>}
      <TextField
        {...fieldProps('cep')}
        label="CEP"
        placeholder="00000-000"
        inputProps={{ maxLength: 9, inputMode: 'numeric' }}
        onChange={(event) => {
          const masked = maskCep(event.target.value);
          setFieldValue('cep', masked);
          if (onlyDigits(masked).length === 8) buscarCep(masked);
        }}
        InputProps={{
          startAdornment: <InputAdornment position="start">{loadingCep ? <CircularProgress size={18} /> : <SearchIcon color="action" />}</InputAdornment>,
        }}
      />
      <TextField {...fieldProps('logradouro')} label="Logradouro" placeholder="Rua, avenida ou praça" InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon color="action" /></InputAdornment> }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField {...fieldProps('numero')} label="Número" placeholder="123" />
        <TextField {...fieldProps('complemento')} label="Complemento (opcional)" placeholder="Apto, bloco..." />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField {...fieldProps('bairro')} label="Bairro" />
        <TextField {...fieldProps('cidade')} label="Cidade" />
        <TextField
          {...fieldProps('estado')}
          label="UF"
          inputProps={{ maxLength: 2 }}
          onChange={(event) => setFieldValue('estado', event.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
          sx={{ ...inputSx, minWidth: { sm: 90 } }}
        />
      </Stack>
    </Stack>
  );
};

export default AddressFields;

