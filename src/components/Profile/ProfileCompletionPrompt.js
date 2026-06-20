import React, { useEffect, useState } from 'react';
import { Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProfileService from '../../services/ProfileService';

const ProfileCompletionPrompt = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    ProfileService.get().then(setProfile).catch(() => setProfile(null));
  }, []);

  if (!profile || profile.completo || dismissed) return null;

  return (
    <Alert
      severity="info"
      action={
        <>
          <Button color="inherit" onClick={() => setDismissed(true)}>Agora não</Button>
          <Button color="inherit" variant="outlined" onClick={() => navigate('/perfil')}>Completar perfil</Button>
        </>
      }
    >
      Complete telefone e endereço para facilitar o contato e personalizar sua experiência.
    </Alert>
  );
};

export default ProfileCompletionPrompt;
