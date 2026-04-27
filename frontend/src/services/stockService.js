import api from './api'

const stockService = {
  getAll: () => api.get('/stock/'),
  getAlerts: () => api.get('/stock/alertes'),
  create: (data) => api.post('/stock', data)
}

export default stockService