import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 secondes
})

// ✅ Intercepteur REQUÊTE : lit TOUJOURS depuis localStorage (plus fiable)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token.trim()}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// ✅ Intercepteur RÉPONSE : gère les erreurs 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token invalide ou expiré → déconnexion')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Ne pas rediriger immédiatement si on est déjà sur /login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    if (error.response?.status === 403) {
      console.warn('Accès refusé (403)')
    }
    return Promise.reject(error)
  }
)

export default api