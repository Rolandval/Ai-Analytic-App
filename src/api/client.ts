import axios, { type InternalAxiosRequestConfig } from 'axios';
import { getToken, setToken, removeToken } from '@/lib/secureStorage';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  process.env.VITE_API_URL ??
  process.env.REACT_APP_API_URL ??
  '';

if (!BASE_URL) {
  console.warn(
    '[api] Missing EXPO_PUBLIC_API_URL (or VITE_API_URL / REACT_APP_API_URL). Set it in .env'
  );
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

let accessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedToken = await getToken();
        if (!storedToken) {
          throw new Error('No stored token');
        }
        accessToken = storedToken;
        originalRequest.headers.Authorization = `Bearer ${storedToken}`;
        processQueue(null, storedToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        accessToken = null;
        await removeToken();
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
