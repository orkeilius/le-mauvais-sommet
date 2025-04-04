import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:80/api', // ou l'URL de votre backend Laravel
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Ajouter un intercepteur pour le token d'authentification si nécessaire
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;