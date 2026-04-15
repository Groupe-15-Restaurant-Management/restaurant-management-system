import api from './api';

const menuService = {
    /**
     * Récupère tous les plats avec filtres
     * @param {Object} filters - {categorie, search, disponibilite}
     * @returns {Promise}
     */
    async getPlats(filters = {}) {
        const params = new URLSearchParams();
        
        if (filters.categorie) params.append('categorie', filters.categorie);
        if (filters.search) params.append('search', filters.search);
        if (filters.disponibilite !== undefined) params.append('disponibilite', filters.disponibilite);
        if (filters.skip) params.append('skip', filters.skip);
        if (filters.limit) params.append('limit', filters.limit);
        
        const response = await api.get(`/plats?${params.toString()}`);
        return response.data;
    },

    /**
     * Récupère un plat par son ID
     * @param {number} id
     * @returns {Promise}
     */
    async getPlatById(id) {
        const response = await api.get(`/plats/${id}`);
        return response.data;
    },

    /**
     * Récupère la liste des catégories
     * @returns {Promise}
     */
    async getCategories() {
        const response = await api.get('/plats/categories/list');
        return response.data.categories;
    },

    /**
     * Crée un nouveau plat (admin)
     * @param {Object} platData
     * @returns {Promise}
     */
    async createPlat(platData) {
        const response = await api.post('/plats', platData);
        return response.data;
    },

    /**
     * Modifie un plat (admin)
     * @param {number} id
     * @param {Object} platData
     * @returns {Promise}
     */
    async updatePlat(id, platData) {
        const response = await api.put(`/plats/${id}`, platData);
        return response.data;
    },

    /**
     * Supprime un plat (admin)
     * @param {number} id
     * @returns {Promise}
     */
    async deletePlat(id) {
        await api.delete(`/plats/${id}`);
    },

    /**
     * Active/désactive la disponibilité d'un plat
     * @param {number} id
     * @param {boolean} disponibilite
     * @returns {Promise}
     */
    async toggleDisponibilite(id, disponibilite) {
        const response = await api.patch(`/plats/${id}/disponibilite?disponibilite=${disponibilite}`);
        return response.data;
    }
};

export default menuService;