import React, { useEffect, useState } from 'react';
import {
  Alert, Avatar, Box, Button, Card, CardContent, CircularProgress, Divider,
  Grid, IconButton, InputAdornment, Stack, TextField, Typography,
} from '@mui/material';
import {
  BusinessOutlined, LockOutlined, ManageAccountsOutlined, PersonOutline,
  SaveOutlined, VisibilityOffOutlined, VisibilityOutlined,
} from '@mui/icons-material';
import ProfileService from '../../services/ProfileService';
import AddressFields from '../Register/AddressFields';
import { maskCnpj, maskCpf, maskPhone } from '../../utils/masks';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

const editableFields = [
  'telefone', 'cep', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade',
  'estado', 'nomeFantasia', 'emailInstitucional',
];

const emptyPassword = { senhaAtual: '', novaSenha: '', confirmacaoSenha: '' };

const ProfilePage = () => {
  const { notifySuccess, notifyError } = useNotification();
  const { establishSession } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwords, setPasswords] = useState(emptyPassword);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    ProfileService.get()
      .then((data) => {
        setProfile(data);
        setForm(Object.fromEntries(editableFields.map((field) => [field, data[field] || ''])));
      })
      .catch(() => notifyError('Não foi possível carregar o perfil.'))
      .finally(() => setLoading(false));
  }, [notifyError]);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const updated = await ProfileService.update(form);
      setProfile(updated);
      setForm(Object.fromEntries(editableFields.map((field) => [field, updated[field] || ''])));
      notifySuccess('Perfil atualizado com sucesso.');
    } catch (error) {
      const fieldErrors = error.response?.data?.errors;
      if (fieldErrors) setErrors(fieldErrors);
      else notifyError('Não foi possível atualizar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setChangingPassword(true);
    setPasswordErrors({});
    try {
      const session = await ProfileService.changePassword(passwords);
      establishSession(session);
      setPasswords(emptyPassword);
      notifySuccess('Senha alterada com sucesso.');
    } catch (error) {
      const fieldErrors = error.response?.data?.errors;
      if (fieldErrors) setPasswordErrors(fieldErrors);
      else notifyError('Não foi possível alterar a senha.');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <Box sx={{ minHeight: 320, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;
  if (!profile) return <Alert severity="error">Não foi possível carregar os dados da conta.</Alert>;

  const isCompany = profile.tipoConta === 'EMPRESA';
  const document = isCompany ? maskCnpj(profile.documento || '') : maskCpf(profile.documento || '');
  const textField = (name, label, props = {}) => (
    <TextField
      fullWidth name={name} label={label} value={form[name] || ''}
      onChange={(event) => update(name, event.target.value)}
      error={Boolean(errors[name])} helperText={errors[name]} {...props}
    />
  );
  const passwordField = (name, label) => (
    <TextField
      fullWidth name={name} label={label} type={showPasswords ? 'text' : 'password'}
      value={passwords[name]}
      onChange={(event) => {
        setPasswords((current) => ({ ...current, [name]: event.target.value }));
        setPasswordErrors((current) => ({ ...current, [name]: undefined }));
      }}
      error={Boolean(passwordErrors[name])} helperText={passwordErrors[name]}
      InputProps={{
        startAdornment: <InputAdornment position="start"><LockOutlined /></InputAdornment>,
        endAdornment: name === 'novaSenha' ? (
          <InputAdornment position="end">
            <IconButton aria-label="Mostrar senhas" onClick={() => setShowPasswords((value) => !value)}>
              {showPasswords ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
    />
  );

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
          {isCompany ? <BusinessOutlined /> : <PersonOutline />}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={800}>Meu perfil</Typography>
          <Typography color="text.secondary">Gerencie seus dados pessoais e a segurança da conta.</Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card variant="outlined">
            <CardContent component="form" onSubmit={saveProfile}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ManageAccountsOutlined color="primary" />
                  <Typography variant="h6" fontWeight={700}>Dados do perfil</Typography>
                </Stack>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label={isCompany ? 'Representante' : 'Nome'} value={profile.nome || ''} disabled /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label={isCompany ? 'CNPJ' : 'CPF'} value={document} disabled /></Grid>
                  {isCompany && <Grid size={{ xs: 12 }}><TextField fullWidth label="Razão social" value={profile.razaoSocial || ''} disabled /></Grid>}
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="E-mail de acesso" value={profile.emailAcesso || ''} disabled /></Grid>
                </Grid>

                <Divider />
                <Typography variant="subtitle1" fontWeight={700}>Contato e endereço</Typography>
                {isCompany && (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>{textField('nomeFantasia', 'Nome fantasia')}</Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>{textField('emailInstitucional', 'E-mail institucional', { type: 'email' })}</Grid>
                  </Grid>
                )}
                {textField('telefone', 'Telefone com DDD', {
                  onChange: (event) => update('telefone', maskPhone(event.target.value)),
                  inputProps: { maxLength: 15, inputMode: 'tel' },
                })}
                <AddressFields
                  values={form} errors={errors}
                  touched={Object.fromEntries(editableFields.map((field) => [field, true]))}
                  handleBlur={() => {}} setFieldValue={update}
                />
                <Button type="submit" variant="contained" startIcon={<SaveOutlined />} disabled={saving} sx={{ alignSelf: 'flex-start' }}>
                  {saving ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card variant="outlined">
            <CardContent component="form" onSubmit={changePassword}>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LockOutlined color="primary" />
                  <Typography variant="h6" fontWeight={700}>Alterar senha</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  A nova senha deve conter pelo menos 8 caracteres, com maiúscula, minúscula, número e símbolo.
                </Typography>
                {passwordField('senhaAtual', 'Senha atual')}
                {passwordField('novaSenha', 'Nova senha')}
                {passwordField('confirmacaoSenha', 'Confirmar nova senha')}
                <Button type="submit" variant="outlined" disabled={changingPassword}>
                  {changingPassword ? 'Alterando...' : 'Alterar senha'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ProfilePage;
