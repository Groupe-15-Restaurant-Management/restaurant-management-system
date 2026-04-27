import api from './api'

const orderService = {
  async createCommande(commandeData) {
    const response = await api.post('/commandes', commandeData)
    return response.data
  },

  async getCommandes() {
    const response = await api.get('/commandes')
    return response.data
  },

  async getCommande(id) {
    const response = await api.get(`/commandes/${id}`)
    return response.data
  },

  async updateCommande(id, commandeData) {
    const response = await api.put(`/commandes/${id}`, commandeData)
    return response.data
  }
}

export default orderService