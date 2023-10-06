import axios from 'axios';

const currentPort = window.location.port;

export const BASE_URL = import.meta.env.DEV
  ? `http://3.39.67.85`
  : import.meta.env.VITE_API_URL;

export const WS_BASE_URL = import.meta.env.DEV
  ? `ws://3.39.67.85:8080`
  : `${import.meta.env.VITE_API_URL}`.replace('http', 'ws'); // port 번호 붙일지 말지 결정하기

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
