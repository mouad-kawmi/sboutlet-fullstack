import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor to add Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('sboutlet_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // If we're sending images, we need to change content-type
    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
});

export default api;
