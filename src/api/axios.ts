import axios from 'axios';

const { DEV, VITE_API_URL } = import.meta.env;

const CURRENT_PORT = window.location.port;
const LOCALHOST = `http://localhost`;

export const BASE_URL = DEV ? `${LOCALHOST}:${CURRENT_PORT}` : VITE_API_URL;
export const WS_BASE_URL = DEV
  ? `${LOCALHOST}:8080`.replace('http', 'ws')
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
