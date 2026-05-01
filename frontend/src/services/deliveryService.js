import api from './api'

const deliveryService = {
  getMyDeliveries: () => api.get('/livraisons/'),
  updateStatus: (id, statut) => api.put(`/livraisons/${id}/status`, { statut })
}

export default deliveryService