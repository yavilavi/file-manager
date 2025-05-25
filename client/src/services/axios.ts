/**
 * File Manager - Axios
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import axios from 'axios';

const [subdomain] = window.location.hostname.split('.');
const protocol = window.location.protocol;
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Regular API call instance that includes the subdomain
const apiCall = axios.create({
  baseURL: `${protocol}//${subdomain}.${baseUrl}`,
});

// Public API instance for endpoints that don't require authentication
export const publicApiCall = axios.create({
  baseURL: `${protocol}//${baseUrl}`,
});

apiCall.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiCall;
