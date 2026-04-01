import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Accept': 'application/json',
    },
});

// Interceptor to add Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('sboutlet_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    const method = (config.method || 'get').toLowerCase();

    // Only send JSON content-type for requests that actually have a JSON body.
    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
    } else if (['post', 'put', 'patch'].includes(method) && !config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
    }

    return config;
});

export default api;
