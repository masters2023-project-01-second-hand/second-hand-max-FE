import axios from 'axios';

const currentPort = window.location.port;
const localHost = 'http://localhost';

export const BASE_URL = import.meta.env.DEV
  ? `${localHost}:${currentPort}`
  : import.meta.env.VITE_API_URL;

export const WS_BASE_URL = import.meta.env.DEV
  ? `${localHost}:8080`
  : BASE_URL.replace('http', 'ws');

export const fetcher = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

fetcher.interceptors.request.use(
  config => {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return config;

    const accessToken = JSON.parse(authStorage).state.accessToken;
    if (accessToken) {
      config.headers['Authorization'] = accessToken;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);
