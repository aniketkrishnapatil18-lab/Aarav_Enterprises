// ============================================================
// Frontend: API Client
// ============================================================

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ae_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  res  => res,
  err  => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ae_token');
      localStorage.removeItem('ae_admin');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// ── Auth ────────────────────────────────────────────────────
export const authAPI = {
  login:          data  => api.post('/auth/login', data),
  me:             ()    => api.get('/auth/me'),
  changePassword: data  => api.post('/auth/change-password', data),
};

// ── Categories ──────────────────────────────────────────────
export const categoryAPI = {
  list:   (params) => api.get('/categories', { params }),
  create: (data)   => api.post('/categories', data),
  update: (id, d)  => api.put(`/categories/${id}`, d),
  remove: (id)     => api.delete(`/categories/${id}`),
};

// ── Products / Services ─────────────────────────────────────
export const productAPI = {
  list:   (params) => api.get('/products', { params }),
  detail: (id)     => api.get(`/products/${id}`),
  create: (fd)     => api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, fd) => api.put(`/products/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggle: (id)     => api.put(`/products/${id}/toggle`),
  remove: (id)     => api.delete(`/products/${id}`),
};

// ── Portfolio ───────────────────────────────────────────────
export const portfolioAPI = {
  list:     (params) => api.get('/portfolio', { params }),
  detail:   (id)     => api.get(`/portfolio/${id}`),
  create:   (fd)     => api.post('/portfolio', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:   (id, fd) => api.put(`/portfolio/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggle:   (id)     => api.put(`/portfolio/${id}/toggle`),
  waToggle: (id)     => api.put(`/portfolio/${id}/wa-toggle`),
  remove:   (id)     => api.delete(`/portfolio/${id}`),
};

// ── Customers ───────────────────────────────────────────────
export const customerAPI = {
  list:   (params) => api.get('/customers', { params }),
  detail: (id)     => api.get(`/customers/${id}`),
  update: (id, d)  => api.put(`/customers/${id}`, d),
};

// ── Inquiries ───────────────────────────────────────────────
export const inquiryAPI = {
  list:         (params)    => api.get('/inquiries', { params }),
  detail:       (id)        => api.get(`/inquiries/${id}`),
  update:       (id, d)     => api.put(`/inquiries/${id}`, d),
  updateStatus: (id, data)  => api.put(`/inquiries/${id}/status`, data),
  addNote:      (id, data)  => api.post(`/inquiries/${id}/messages`, data),
};

// ── Conversations ───────────────────────────────────────────
export const conversationAPI = {
  list:        (params)   => api.get('/conversations', { params }),
  get:         (id)       => api.get(`/conversations/${id}`),
  detail:      (id)       => api.get(`/conversations/${id}`),
  sendMessage: (id, data) => api.post(`/conversations/${id}/messages`, data),
  updateStatus:(id, data) => api.put(`/conversations/${id}/status`, data),
  close:       (id)       => api.put(`/conversations/${id}/close`),
};

// ── AI Knowledge ────────────────────────────────────────────
export const knowledgeAPI = {
  list:        ()     => api.get('/ai/knowledge'),
  bulkUpdate:  (data) => api.put('/ai/knowledge', { items: data }),
  upsertOne:   (data) => api.post('/ai/knowledge', data),
};

// ── Notifications ───────────────────────────────────────────
export const notificationAPI = {
  list:     (params) => api.get('/notifications', { params }),
  markRead: (id)     => api.put(`/notifications/${id}/read`),
  markAll:  ()       => api.put('/notifications/all/read'),
};

// ── Reports ─────────────────────────────────────────────────
export const reportAPI = {
  summary:    () => api.get('/reports/summary'),
  byService:  () => api.get('/reports/by-service'),
  byLanguage: () => api.get('/reports/by-language'),
  byStatus:   () => api.get('/reports/by-status'),
};

// ── Settings ────────────────────────────────────────────────
export const settingsAPI = {
  getPublic: () => api.get('/settings'),
  getAdmin:  () => api.get('/settings/admin'),
  update:    (settings) => api.put('/settings', { settings }),
};

// ── WhatsApp (Dev Testing) ──────────────────────────────────
export const whatsappAPI = {
  testMessage: (data) => api.post('/whatsapp/test', data),
};

// ── Unsplash API ────────────────────────────────────────────
export const unsplashAPI = {
  search: (params) => api.get('/unsplash/search', { params }),
};

export default api;
