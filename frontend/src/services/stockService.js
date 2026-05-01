import api from './api'

const stockService = {
  getAll: () => api.get('/stock/'),
  getAlerts: () => api.get('/stock/alertes'),
  create: (data) => api.post('/stock', data),
  update: (id, data) => api.put(`/stock/${id}`, data),
  delete: (id) => api.delete(`/stock/${id}`)
}

export default stockService