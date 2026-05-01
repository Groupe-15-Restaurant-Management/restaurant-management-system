import api from './api'

const kitchenService = {
  async getCommandes() {
    const response = await api.get('/kitchen/commandes')
    return response.data
  },

  async updateStatus(id, statut) {
    const response = await api.put(`/kitchen/commandes/${id}/status`, { statut })
    return response.data
  }
}

export default kitchenService