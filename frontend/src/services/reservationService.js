import api from './api'

const reservationService = {
  async getReservations(date = null) {
    const params = {}
    if (date) params.date = date
    const response = await api.get('/reservations', { params })
    return response.data
  },

  async createReservation(reservationData) {
    const response = await api.post('/reservations', reservationData)
    return response.data
  },

  async getAvailable(dateHeure, nbPersons) {
    const response = await api.get('/reservations/available', {
      params: { 
        date_heure: dateHeure, 
        nombre_personnes: nbPersons 
      }
    })
    return response.data
  },

  async createInvited(reservationData) {
    const response = await api.post('/reservations/invited', reservationData)
    return response.data
  },

  async updateStatus(id, statut) {
    const response = await api.put(`/reservations/${id}/status`, { statut })
    return response.data
  }
}

export default reservationService