import api from './api'

const paymentService = {
  process: (data) => api.post('/paiements', data),
}

export default paymentService