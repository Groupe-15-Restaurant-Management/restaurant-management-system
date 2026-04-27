import api from './api'

const menuService = {
  async getPlats(categorie = null, disponible = true) {
    const params = {}
    if (categorie) params.categorie = categorie
    if (disponible !== null) params.disponible = disponible
    
    const response = await api.get('/plats', { params })
    return response.data
  },

  async getPlat(id) {
    const response = await api.get(`/plats/${id}`)
    return response.data
  },

  async createPlat(platData) {
    const response = await api.post('/plats', platData)
    return response.data
  },

  async updatePlat(id, platData) {
    const response = await api.put(`/plats/${id}`, platData)
    return response.data
  },

  async deletePlat(id) {
    const response = await api.delete(`/plats/${id}`)
    return response.data
  }
}

export default menuService