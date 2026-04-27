import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import axios from 'axios'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // ✅ Fonction pour initialiser les headers axios (réutilisable)
  const setAuthHeaders = useCallback((token) => {
    if (token) {
      const cleanToken = token.trim()
      axios.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`
      // Aussi mettre à jour l'instance personnalisée si elle existe
      if (authService.setToken) {
        authService.setToken(cleanToken)
      }
    } else {
      delete axios.defaults.headers.common['Authorization']
      if (authService.setToken) {
        authService.setToken(null)
      }
    }
  }, [])

  // ✅ Initialisation au montage : lecture localStorage + validation token
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        if (token && userData) {
          // Parser les données utilisateur avec gestion d'erreur
          const parsedUser = JSON.parse(userData)
          
          // Optionnel : valider le token côté backend avant de l'accepter
          // await authService.validateToken(token) // Si vous avez cet endpoint
          
          setUser(parsedUser)
          setAuthHeaders(token)
        }
      } catch (error) {
        console.error('Erreur initialisation auth:', error)
        // Nettoyer les données corrompues
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setAuthHeaders(null)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }
    
    initAuth()
  }, [setAuthHeaders])

  // ✅ Fonction de connexion - NE REDIRIGE PAS (App.jsx s'en charge)
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      const cleanToken = response.access_token?.trim()
      
      if (!cleanToken || !response.user) {
        throw new Error('Réponse d\'authentification invalide')
      }
      
      // 1. Stocker dans localStorage (synchrone)
      localStorage.setItem('token', cleanToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      // 2. Mettre à jour les headers axios IMMÉDIATEMENT
      setAuthHeaders(cleanToken)
      
      // 3. Mettre à jour l'état React (asynchrone, mais les headers sont déjà prêts)
      setUser(response.user)
      
      return response
    } catch (error) {
      // Nettoyer en cas d'échec pour éviter les sessions fantômes
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setAuthHeaders(null)
      throw error
    }
  }

  // ✅ Fonction de déconnexion - NETTOYAGE COMPLET
  const logout = useCallback(() => {
    // 1. Supprimer du localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // 2. Supprimer les headers axios
    setAuthHeaders(null)
    
    // 3. Réinitialiser l'état React
    setUser(null)
    
    // Note : La redirection vers /login est gérée par App.jsx via ProtectedRoute
  }, [setAuthHeaders])

  // ✅ Valeur du contexte mémorisée pour éviter les re-renders inutiles
  const contextValue = React.useMemo(() => ({
    user,
    isLoading,
    isInitialized,
    login,
    logout
  }), [user, isLoading, isInitialized, login, logout])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// ✅ Hook personnalisé avec nom cohérent
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}