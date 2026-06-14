import axios from 'axios';

const GeocodingService = {
  buscar: async (query) => {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { format: 'json', q: `${query}, Brasil`, limit: 5 },
      headers: { 'Accept-Language': 'pt-BR' },
    });
    return response.data;
  },
};

export default GeocodingService;
