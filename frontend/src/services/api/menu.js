/**
 * Menu API service
 */
import api from './api';

export const menuService = {
    getAll: () => api.get('/menu'),
    getById: (id) => api.get(`/menu/${id}`),
    create: (formData) => {
        // Don't set Content-Type header - browser will set it with boundary for FormData
        return api.post('/menu', formData);
    },
    update: (id, formData) => {
        // Don't set Content-Type header - browser will set it with boundary for FormData
        return api.put(`/menu/${id}`, formData);
    },
    delete: (id) => api.delete(`/menu/${id}`)
};

