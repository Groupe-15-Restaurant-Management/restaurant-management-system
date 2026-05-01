import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useWebSocket } from '../../hooks/useWebSocket'
import kitchenService from '../../services/kitchenService'
import { Clock, ChefHat, CheckCircle, Bell } from 'lucide-react'

const KitchenBoard = () => {
  const [commandes, setCommandes] = useState([])
  const [loading, setLoading] = useState(true)

  // Connexion WebSocket à la room "kitchen"
  useWebSocket('kitchen', {
    new_order: useCallback((data) => {
      // Nouvelle commande reçue en temps réel
      setCommandes(prev => [data.commande, ...prev])
      // Notification sonore/visuelle
      playNotificationSound()
    }, []),
    
    order_status_updated: useCallback((data) => {
      // Mise à jour de statut d'une commande
      setCommandes(prev => prev.map(c => 
        c.id === data.commande_id ? { ...c, statut: data.new_status } : c
      ))
    }, [])
  })

  // Chargement initial
  const loadCommandes = useCallback(async () => {
    try {
      const data = await kitchenService.getCommandes()
      setCommandes(data)
    } catch (error) {
      console.error('Erreur chargement commandes:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCommandes()
  }, [loadCommandes])

  // Mise à jour du statut d'une commande
  const updateStatus = useCallback(async (commandeId, newStatus) => {
    try {
      await kitchenService.updateStatus(commandeId, newStatus)
      // Mise à jour locale immédiate pour réactivité
      setCommandes(prev => prev.map(c => 
        c.id === commandeId ? { ...c, statut: newStatus } : c
      ))
    } catch (error) {
      console.error('Erreur mise à jour statut:', error)
    }
  }, [])

  // Fonction de notification sonore
  const playNotificationSound = useCallback(() => {
    // Optionnel: jouer un son court pour alerter la cuisine
    // const audio = new Audio('/notification.mp3')
    // audio.play().catch(() => {}) // Ignorer les erreurs de autoplay
  }, [])

  // Groupement des commandes par statut (memoized)
  const groupedCommandes = useMemo(() => {
    return {
      en_attente: commandes.filter(c => c.statut === 'en_attente'),
      en_preparation: commandes.filter(c => c.statut === 'en_preparation'),
      prete: commandes.filter(c => c.statut === 'prete')
    }
  }, [commandes])

  const formatTime = useCallback((dateString) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec notification */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ChefHat className="h-6 w-6 mr-2" />
            Tableau de Cuisine
          </h1>
          <button 
            onClick={loadCommandes}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Bell className="h-4 w-4 mr-2" />
            Rafraîchir
          </button>
        </div>
      </div>

      {/* Colonnes Kanban */}
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['en_attente', 'en_preparation', 'prete'].map(status => (
            <div key={status} className="space-y-4">
              {/* En-tête de colonne */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center justify-between">
                  {status === 'en_attente' && '🟡 En attente'}
                  {status === 'en_preparation' && '🟠 En préparation'}
                  {status === 'prete' && '🟢 Prêtes'}
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                    {groupedCommandes[status]?.length || 0}
                  </span>
                </h2>
              </div>

              {/* Liste des commandes */}
              <div className="space-y-4">
                {groupedCommandes[status]?.map(commande => (
                  <div
                    key={commande.id}
                    className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">Table {commande.table?.numero}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          commande.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                          commande.statut === 'en_preparation' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {commande.statut}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(commande.date_heure)}
                      </div>
                    </div>

                    {/* Lignes de commande */}
                    <div className="space-y-2 mb-4">
                      {commande.lignes?.map((ligne, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">
                            {ligne.quantite}x {ligne.plat?.nom}
                          </span>
                          {ligne.notes && (
                            <span className="text-orange-600 text-xs">({ligne.notes})</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      {commande.statut === 'en_attente' && (
                        <button
                          onClick={() => updateStatus(commande.id, 'en_preparation')}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          Démarrer
                        </button>
                      )}
                      {commande.statut === 'en_preparation' && (
                        <button
                          onClick={() => updateStatus(commande.id, 'prete')}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm flex items-center justify-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Prête
                        </button>
                      )}
                      {commande.statut === 'prete' && (
                        <div className="flex-1 text-green-600 text-sm font-medium flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 mr-1" />
                          Terminée
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {(!groupedCommandes[status] || groupedCommandes[status].length === 0) && (
                  <div className="text-center py-8 text-gray-400 bg-white rounded-lg">
                    Aucune commande
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default React.memo(KitchenBoard)