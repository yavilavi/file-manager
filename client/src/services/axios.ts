import axios from 'axios';

const [subdomain] = window.location.hostname.split('.');
const protocol = window.location.protocol;
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const apiCall = axios.create({
  baseURL: `${protocol}//${subdomain}.${baseUrl}`,
});

apiCall.interceptors.request.use((config) => {
  const token = localStorage.getItem('atok');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiCall;
