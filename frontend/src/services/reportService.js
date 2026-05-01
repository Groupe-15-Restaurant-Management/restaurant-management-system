import api from './api'

const reportService = {
  /**
   * Génère un rapport journalier ou mensuel
   * @param {Object} data - { type: 'journalier'|'mensuel', date_debut, date_fin }
   */
  async generateReport(data) {
    const response = await api.post('/rapports/generate', data)
    return response.data
  },

  /**
   * Liste les rapports générés
   */
  async listReports() {
    const response = await api.get('/rapports/')
    return response.data
  },

  /**
   * Télécharge un rapport (retourne blob pour téléchargement)
   * @param {number} id - ID du rapport
   */
  async downloadReport(id) {
    const response = await api.get(`/rapports/download/${id}`, {
      responseType: 'blob'
    })
    return response.data
  }
}

export default reportService