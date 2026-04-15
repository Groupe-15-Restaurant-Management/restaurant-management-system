import api from './api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const authService = {
  /**
   * Connexion utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.access_token) {
        localStorage.setItem(TOKEN_KEY, response.data.access_token);
        if (response.data.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        }
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  /**
   * Inscription utilisateur
   * @param {Object} userData - Données de l'utilisateur {nom, email, telephone, password, role}
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  /**
   * Inscription avec paramètres individuels (pour compatibilité)
   */
  async registerWithParams(nom, email, telephone, password, role = 'client') {
    return this.register({
      nom,
      email,
      telephone,
      password,
      role
    });
  },

  /**
   * Récupérer l'utilisateur courant depuis localStorage ou API
   * @param {string} token - Token optionnel pour la requête API
   */
  async getCurrentUser(token = null) {
    try {
      // Essayer d'abord de récupérer depuis localStorage
      const storedUser = this.getStoredUser();
      if (storedUser && this.isAuthenticated()) {
        return storedUser;
      }
      
      // Sinon, faire une requête API
      const config = {};
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }
      const response = await api.get('/auth/me', config);
      
      if (response.data) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      // Si erreur 401, nettoyer le storage
      if (error.response?.status === 401) {
        this.logout();
      }
      throw error;
    }
  },

  /**
   * Récupérer l'utilisateur stocké dans localStorage
   */
  getStoredUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Mettre à jour l'utilisateur stocké
   */
  setStoredUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  },

  /**
   * Déconnexion
   */
  async logout() {
    try {
      // Optionnel: appeler l'API pour invalider le token
      await api.post('/auth/logout').catch(() => {});
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  /**
   * Rafraîchir le token
   */
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh-token');
      if (response.data.access_token) {
        localStorage.setItem(TOKEN_KEY, response.data.access_token);
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      throw error;
    }
  },

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!(token && token !== 'undefined' && token !== 'null');
  },

  /**
   * Obtenir le token
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Vérifier le rôle de l'utilisateur
   */
  hasRole(role) {
    const user = this.getStoredUser();
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  },

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile', userData);
      if (response.data) {
        const currentUser = this.getStoredUser();
        const updatedUser = { ...currentUser, ...response.data };
        this.setStoredUser(updatedUser);
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  }
};

export default authService;
export { authService };