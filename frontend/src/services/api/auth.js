/**
 * Auth API service
 */
import api from './api';

export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (data) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    getCurrentUser: () => api.get('/auth/user')
};

