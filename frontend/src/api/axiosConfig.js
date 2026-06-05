import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL });

// This shows/hides your loader for every request globally
api.interceptors.request.use((config) => {
  document.getElementById('global-loader')?.classList.remove('hidden');
  return config;
});

api.interceptors.response.use((res) => {
  document.getElementById('global-loader')?.classList.add('hidden');
  return res;
});