import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verify token on load
    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('sboutlet_token');
            if (token) {
                try {
                    const response = await api.get('/me');
                    setCurrentUser(response.data);
                } catch (error) {
                    localStorage.removeItem('sboutlet_token');
                    setCurrentUser(null);
                }
            }
            setLoading(false);
        };
        verifyToken();
    }, []);

    const register = async (name, email, password, password_confirmation) => {
        try {
            const response = await api.post('/register', {
                name,
                email,
                password,
                password_confirmation: password // Assuming simple confirm for now
            });
            const { access_token, user } = response.data;
            localStorage.setItem('sboutlet_token', access_token);
            setCurrentUser(user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Erreur lors de l\'inscription.'
            };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            const { access_token, user } = response.data;
            localStorage.setItem('sboutlet_token', access_token);
            setCurrentUser(user);
            return { success: true, role: user.role };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Identifiants incorrects.'
            };
        }
    };

    const updateProfile = async (data) => {
        try {
            const response = await api.put('/profile', data);
            setCurrentUser(response.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Erreur lors de la mise à jour.'
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('sboutlet_token');
            setCurrentUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, register, login, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
