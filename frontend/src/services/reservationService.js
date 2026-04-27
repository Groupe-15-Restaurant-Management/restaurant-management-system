import api from './api'

const reservationService = {
  /**
   * Récupère toutes les réservations (admin/serveur uniquement)
   * @param {string|null} date - Filtrer par date (format ISO)
   */
  async getReservations(date = null) {
    const params = {}
    if (date) params.date = date
    const response = await api.get('/reservations', { params })
    return response.data
  },

  /**
   * Récupère une réservation par son ID
   * @param {number} id - ID de la réservation
   */
  async getReservation(id) {
    const response = await api.get(`/reservations/${id}`)
    return response.data
  },

  /**
   * Crée une réservation (serveur/admin connecté)
   * @param {Object} reservationData - Données de la réservation
   */
  async createReservation(reservationData) {
    const response = await api.post('/reservations', reservationData)
    return response.data
  },

  /**
   * Met à jour une réservation existante
   * @param {number} id - ID de la réservation
   * @param {Object} reservationData - Données à mettre à jour
   */
  async updateReservation(id, reservationData) {
    const response = await api.put(`/reservations/${id}`, reservationData)
    return response.data
  },

  /**
   * Supprime une réservation
   * @param {number} id - ID de la réservation à supprimer
   */
  async deleteReservation(id) {
    const response = await api.delete(`/reservations/${id}`)
    return response.data
  },

  /**
   * Vérifie les tables disponibles pour un créneau (PUBLIC - sans auth)
   * @param {string} dateHeure - Date et heure (format ISO)
   * @param {number} nbPersons - Nombre de personnes
   */
  async getAvailable(dateHeure, nbPersons) {
    const response = await api.get('/reservations/available', {
      params: { 
        date_heure: dateHeure, 
        nombre_personnes: nbPersons 
      }
    })
    return response.data
  },

  /**
   * Crée une réservation "invité" (sans compte utilisateur - PUBLIC)
   * @param {Object} reservationData - Données de réservation invité
   * @property {number} table_id
   * @property {string} date_heure
   * @property {number} nombre_personnes
   * @property {string} nom_contact
   * @property {string} telephone
   * @property {string} [email]
   * @property {string} [occasion]
   * @property {string} [demandes_speciales]
   */
  async createInvited(reservationData) {
    const response = await api.post('/reservations/invited', reservationData)
    return response.data
  },

  /**
   * Met à jour le statut d'une réservation (confirmée/annulée)
   * @param {number} id - ID de la réservation
   * @param {string} statut - Nouveau statut ('confirmee' | 'annulee' | 'terminee')
   */
  async updateStatus(id, statut) {
    const response = await api.put(`/reservations/${id}/status`, { statut })
    return response.data
  }
}

export default reservationService