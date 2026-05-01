import { useEffect, useRef, useCallback } from 'react'
import websocketService from '../services/websocketService'
import { useAuth } from './useAuth'

/**
 * Hook personnalisé pour gérer les connexions WebSocket
 * @param {string} room - Nom de la room (ex: "kitchen", "order_123")
 * @param {Object} handlers - Callbacks par événement { new_order: (data) => {...} }
 */
export const useWebSocket = (room, handlers = {}) => {
  const { user } = useAuth()
  const handlersRef = useRef(handlers)
  const isMounted = useRef(true)

  // Mettre à jour les handlers sans recréer la connexion
  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  useEffect(() => {
    isMounted.current = true

    if (room && user?.id) {
      // Connexion avec token
      const token = localStorage.getItem('token')
      websocketService.connect(room, token)

      // Enregistrement des listeners
      Object.entries(handlersRef.current).forEach(([event, callback]) => {
        websocketService.on(event, callback)
      })
    }

    // Cleanup à la démontage
    return () => {
      isMounted.current = false
      Object.entries(handlersRef.current).forEach(([event]) => {
        websocketService.off(event)
      })
      // Ne pas déconnecter ici si d'autres composants utilisent la même room
    }
  }, [room, user?.id])

  // Fonction pour envoyer un message
  const send = useCallback((message) => {
    websocketService.send(message)
  }, [])

  return { send }
}