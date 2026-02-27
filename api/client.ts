/// <reference types="vite/client" />
import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log('🔧 API Client Configuration:');
console.log('  - VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('  - Final API_URL:', API_URL);


const client = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add access token to requests
client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Handle 401 and Refresh Token
client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                        refresh_token: refreshToken
                    });

                    const newAccessToken = response.data.access_token;
                    const newRefreshToken = response.data.refresh_token;

                    localStorage.setItem('access_token', newAccessToken);
                    if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);

                    client.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                    if (originalRequest.headers) {
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    }

                    return client(originalRequest as InternalAxiosRequestConfig);
                } catch (refreshError) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default client;
