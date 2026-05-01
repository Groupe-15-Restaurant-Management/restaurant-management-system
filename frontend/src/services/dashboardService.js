import api from './api'

const dashboardService = {
  /**
   * Récupère les KPIs du dashboard
   */
  async getKPIs() {
    const response = await api.get('/dashboard/kpis')
    return response.data
  },

  /**
   * Récupère l'évolution du CA sur N jours
   * @param {number} days - Nombre de jours (default: 30)
   */
  async getRevenueTrend(days = 30) {
    const response = await api.get(`/dashboard/revenue-trend?days=${days}`)
    return response.data
  },

  /**
   * Récupère les plats les plus vendus
   * @param {number} limit - Nombre de plats (default: 5)
   */
  async getPopularPlats(limit = 5) {
    const response = await api.get(`/dashboard/popular-plats?limit=${limit}`)
    return response.data
  }
}

export default dashboardService