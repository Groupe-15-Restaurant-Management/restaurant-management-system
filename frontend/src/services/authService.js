import api from './api'

class AuthService {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('token', token.trim())
    } else {
      localStorage.removeItem('token')
    }
  }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export default new AuthService()