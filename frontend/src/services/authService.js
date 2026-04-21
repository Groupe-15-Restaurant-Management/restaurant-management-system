import api from './api'
import axios from 'axios'

class AuthService {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  }

  setToken(token) {
    // ✅ CORRECTION: Sauvegarde dans localStorage
    if (token) {
      localStorage.setItem('token', token.trim())
    } else {
      localStorage.removeItem('token')
    }
    
    // Mise à jour des headers axios
    if (api.defaults && api.defaults.headers) {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token.trim()}`
      } else {
        delete api.defaults.headers.common['Authorization']
      }
    }
    
    // Mise à jour des headers axios global
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.trim()}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }
}

export { axios }
export default new AuthService()