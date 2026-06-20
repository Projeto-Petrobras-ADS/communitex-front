import api from './api';

const ProfileService = {
  get: async () => (await api.get('/api/profile')).data,
  update: async (profile) => (await api.put('/api/profile', profile)).data,
  changePassword: async (passwords) => (await api.put('/api/profile/password', passwords)).data,
};

export default ProfileService;
