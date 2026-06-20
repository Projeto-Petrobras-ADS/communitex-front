import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Alert, Box, Button, Card, CardContent, Checkbox, CircularProgress,
  FormControlLabel, FormHelperText, IconButton, InputAdornment, Paper,
  Stack, TextField, ToggleButton, ToggleButtonGroup, Typography,
} from '@mui/material';
import {
  BusinessOutlined, EmailOutlined, LockOutlined, PersonOutline,
  VisibilityOffOutlined, VisibilityOutlined,
} from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { isValidCnpj, isValidCpf, maskCnpj, maskCpf, onlyDigits } from '../../utils/masks';

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const schema = Yup.object({
  tipoConta: Yup.string().oneOf(['PESSOA_FISICA', 'EMPRESA']).required(),
  nome: Yup.string().when('tipoConta', {
    is: 'PESSOA_FISICA',
    then: (value) => value.min(3, 'Informe seu nome completo').required('Nome é obrigatório'),
    otherwise: (value) => value.strip(),
  }),
  cpf: Yup.string().when('tipoConta', {
    is: 'PESSOA_FISICA',
    then: (value) => value.test('cpf', 'CPF inválido', isValidCpf).required('CPF é obrigatório'),
    otherwise: (value) => value.strip(),
  }),
  razaoSocial: Yup.string().when('tipoConta', {
    is: 'EMPRESA',
    then: (value) => value.required('Razão social é obrigatória'),
    otherwise: (value) => value.strip(),
  }),
  cnpj: Yup.string().when('tipoConta', {
    is: 'EMPRESA',
    then: (value) => value.test('cnpj', 'CNPJ inválido', isValidCnpj).required('CNPJ é obrigatório'),
    otherwise: (value) => value.strip(),
  }),
  nomeRepresentante: Yup.string().when('tipoConta', {
    is: 'EMPRESA',
    then: (value) => value.min(3, 'Informe o nome completo').required('Representante é obrigatório'),
    otherwise: (value) => value.strip(),
  }),
  email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  senha: Yup.string().matches(passwordRule, 'Use 8 caracteres com maiúscula, minúscula, número e símbolo').required('Senha é obrigatória'),
  confirmacaoSenha: Yup.string().oneOf([Yup.ref('senha')], 'As senhas devem ser iguais').required('Confirme sua senha'),
  aceitouTermos: Yup.boolean().oneOf([true], 'Você deve aceitar os termos de uso'),
});

const Field = ({ name, label, values, errors, touched, handleChange, handleBlur, ...props }) => (
  <TextField
    fullWidth name={name} label={label} value={values[name]} onChange={handleChange}
    onBlur={handleBlur} error={touched[name] && Boolean(errors[name])}
    helperText={touched[name] && errors[name]} {...props}
  />
);

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { establishSession } = useAuth();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const initialType = searchParams.get('tipo') === 'empresa' ? 'EMPRESA' : 'PESSOA_FISICA';

  const submit = async (values, { setErrors, setSubmitting }) => {
    setServerError('');
    try {
      const payload = {
        tipoConta: values.tipoConta,
        nome: values.tipoConta === 'PESSOA_FISICA' ? values.nome.trim() : null,
        cpf: values.tipoConta === 'PESSOA_FISICA' ? onlyDigits(values.cpf) : null,
        razaoSocial: values.tipoConta === 'EMPRESA' ? values.razaoSocial.trim() : null,
        cnpj: values.tipoConta === 'EMPRESA' ? onlyDigits(values.cnpj) : null,
        nomeRepresentante: values.tipoConta === 'EMPRESA' ? values.nomeRepresentante.trim() : null,
        email: values.email.trim(),
        senha: values.senha,
        confirmacaoSenha: values.confirmacaoSenha,
        aceitouTermos: values.aceitouTermos,
      };
      const response = await api.post('/api/auth/register', payload);
      establishSession(response.data);
      navigate('/dashboard', { replace: true, state: { registrationSuccess: true } });
    } catch (error) {
      const fieldErrors = error.response?.data?.errors;
      if (fieldErrors) setErrors(fieldErrors);
      else setServerError(error.response?.data?.message || 'Não foi possível concluir o cadastro. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'grid', placeItems: 'center', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 880, overflow: 'hidden' }}>
        <Stack direction={{ xs: 'column', md: 'row' }}>
          <Box sx={{ width: { md: '38%' }, bgcolor: 'primary.main', color: 'primary.contrastText', p: { xs: 3, md: 5 } }}>
            <Typography variant="h4" fontWeight={800}>Communitex</Typography>
            <Typography sx={{ mt: 2, opacity: 0.9 }}>
              Crie sua conta e comece a transformar os espaços da sua comunidade.
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 4 }}>
              <Typography fontWeight={700}>Cadastro mais simples</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>Agora pedimos apenas os dados necessários para você começar.</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>Telefone e endereço podem ser preenchidos depois.</Typography>
            </Stack>
          </Box>

          <CardContent sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
            <Typography variant="h5" fontWeight={800}>Criar conta</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Como você quer participar?</Typography>

            {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

            <Formik
              initialValues={{
                tipoConta: initialType, nome: '', cpf: '', razaoSocial: '', cnpj: '',
                nomeRepresentante: '', email: '', senha: '', confirmacaoSenha: '', aceitouTermos: false,
              }}
              validationSchema={schema}
              onSubmit={submit}
            >
              {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                <Form noValidate>
                  <ToggleButtonGroup
                    exclusive fullWidth color="primary" value={values.tipoConta}
                    onChange={(_, value) => {
                      if (!value) return;
                      setFieldValue('tipoConta', value);
                      ['nome', 'cpf', 'razaoSocial', 'cnpj', 'nomeRepresentante'].forEach((field) => setFieldValue(field, ''));
                    }}
                    sx={{ mb: 3 }}
                  >
                    <ToggleButton value="PESSOA_FISICA"><PersonOutline sx={{ mr: 1 }} /> Morador</ToggleButton>
                    <ToggleButton value="EMPRESA"><BusinessOutlined sx={{ mr: 1 }} /> Empresa</ToggleButton>
                  </ToggleButtonGroup>

                  <Stack spacing={2}>
                    {values.tipoConta === 'PESSOA_FISICA' ? (
                      <>
                        <Field name="nome" label="Nome completo" {...{ values, errors, touched, handleChange, handleBlur }} />
                        <Field name="cpf" label="CPF" {...{ values, errors, touched, handleBlur }}
                          onChange={(event) => setFieldValue('cpf', maskCpf(event.target.value))}
                          inputProps={{ maxLength: 14, inputMode: 'numeric' }} />
                      </>
                    ) : (
                      <>
                        <Field name="razaoSocial" label="Razão social" {...{ values, errors, touched, handleChange, handleBlur }} />
                        <Field name="cnpj" label="CNPJ" {...{ values, errors, touched, handleBlur }}
                          onChange={(event) => setFieldValue('cnpj', maskCnpj(event.target.value))}
                          inputProps={{ maxLength: 18, inputMode: 'numeric' }} />
                        <Field name="nomeRepresentante" label="Nome do representante" {...{ values, errors, touched, handleChange, handleBlur }} />
                      </>
                    )}

                    <Field name="email" label="E-mail de acesso" type="email" {...{ values, errors, touched, handleChange, handleBlur }}
                      InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlined /></InputAdornment> }} />
                    <Field name="senha" label="Senha" type={showPassword ? 'text' : 'password'} {...{ values, errors, touched, handleChange, handleBlur }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><LockOutlined /></InputAdornment>,
                        endAdornment: <InputAdornment position="end"><IconButton aria-label="Mostrar senha" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}</IconButton></InputAdornment>,
                      }} />
                    <Field name="confirmacaoSenha" label="Confirmar senha" type={showPassword ? 'text' : 'password'} {...{ values, errors, touched, handleChange, handleBlur }} />

                    <Box>
                      <FormControlLabel control={<Checkbox name="aceitouTermos" checked={values.aceitouTermos} onChange={handleChange} />} label="Li e aceito os termos de uso e a política de privacidade" />
                      {touched.aceitouTermos && errors.aceitouTermos && <FormHelperText error>{errors.aceitouTermos}</FormHelperText>}
                    </Box>

                    <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                      {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Criar conta e entrar'}
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>

            <Paper variant="outlined" sx={{ mt: 3, p: 2, textAlign: 'center' }}>
              <Typography variant="body2">Já possui uma conta? <Button component={Link} to="/login" size="small">Fazer login</Button></Typography>
            </Paper>
          </CardContent>
        </Stack>
      </Card>
    </Box>
  );
};

export default Register;
