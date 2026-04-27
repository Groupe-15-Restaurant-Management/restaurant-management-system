import React, { useState, useEffect } from 'react'
import kitchenService from '../../services/kitchenService'
import Navbar from '../../components/Layout/Navbar'
import Button from '../../components/Common/Button'
import { Clock, ChefHat, CheckCircle } from 'lucide-react'

const KitchenBoard = () => {
  const [commandes, setCommandes] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(null)

  useEffect(() => {
    console.log('=== KitchenBoard monté ===')
    console.log('Token présent:', !!localStorage.getItem('token'))
    console.log('User:', localStorage.getItem('user'))
    console.log('URL actuelle:', window.location.href)
    
    loadCommandes()
    
    const interval = setInterval(loadCommandes, 30000)
    setRefreshInterval(interval)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [])

  const loadCommandes = async () => {
    try {
      console.log('=== Chargement des commandes ===')
      const data = await kitchenService.getCommandes()
      console.log('Données reçues:', data)
      setCommandes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading commandes:', error)
      console.error('Détail erreur:', error.response?.status, error.response?.data)
      setCommandes([])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (commandeId, newStatus) => {
    try {
      await kitchenService.updateStatus(commandeId, newStatus)
      await loadCommandes()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Erreur lors de la mise à jour du statut')
    }
  }

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'en_attente':
        return 'bg-yellow-50 border-yellow-300'
      case 'en_preparation':
        return 'bg-blue-50 border-blue-300'
      case 'prete':
        return 'bg-green-50 border-green-300'
      default:
        return 'bg-gray-50 border-gray-300'
    }
  }

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'en_attente':
        return <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs font-medium">En attente</span>
      case 'en_preparation':
        return <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-medium">En préparation</span>
      case 'prete':
        return <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-medium">Prête</span>
      default:
        return <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs font-medium">{statut}</span>
    }
  }

  const getColumnTitle = (statut) => {
    switch (statut) {
      case 'en_attente':
        return 'En attente'
      case 'en_preparation':
        return 'En préparation'
      case 'prete':
        return 'Prêtes'
      default:
        return statut
    }
  }

  const groupByStatus = (status) => {
    if (!Array.isArray(commandes)) return []
    return commandes.filter(c => c && c.statut === status)
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  const getTableNumber = (commande) => {
    if (!commande) return '?'
    if (commande.table && commande.table.numero) return commande.table.numero
    if (commande.table_numero) return commande.table_numero
    if (commande.table_id) return `#${commande.table_id}`
    return '?'
  }

  const getPlatName = (ligne) => {
    if (!ligne) return 'Plat inconnu'
    if (ligne.plat && ligne.plat.nom) return ligne.plat.nom
    if (ligne.plat_nom) return ligne.plat_nom
    if (ligne.plat_id) return `Plat #${ligne.plat_id}`
    return 'Plat inconnu'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ChefHat className="h-8 w-8 mr-3" />
              Tableau de Cuisine
            </h1>
            <p className="mt-2 text-gray-600">Gérez les commandes en temps réel</p>
          </div>
          <Button variant="primary" onClick={loadCommandes}>
            Rafraîchir
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['en_attente', 'en_preparation', 'prete'].map(status => (
            <div key={status} className="space-y-4">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center justify-between">
                  {getColumnTitle(status)}
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                    {groupByStatus(status).length}
                  </span>
                </h2>
              </div>

              <div className="space-y-4">
                {groupByStatus(status).map(commande => {
                  if (!commande) return null
                  
                  const tableNumero = getTableNumber(commande)
                  const lignes = commande.lignes || commande.lignes_commande || []
                  
                  return (
                    <div
                      key={commande.id}
                      className={`bg-white rounded-lg shadow p-4 border-l-4 ${getStatusColor(commande.statut)}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">Table {tableNumero}</span>
                          {getStatusBadge(commande.statut)}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTime(commande.date_heure || commande.date)}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {lignes.map((ligne, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">
                              {ligne.quantite || 1}x {getPlatName(ligne)}
                            </span>
                            {ligne.notes && (
                              <span className="text-orange-600 text-xs">({ligne.notes})</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {commande.notes && (
                        <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                          <strong>Notes:</strong> {commande.notes}
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {commande.statut === 'en_attente' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            onClick={() => updateStatus(commande.id, 'en_preparation')}
                          >
                            Démarrer
                          </Button>
                        )}
                        {commande.statut === 'en_preparation' && (
                          <Button
                            variant="success"
                            size="sm"
                            className="flex-1"
                            onClick={() => updateStatus(commande.id, 'prete')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Prête
                          </Button>
                        )}
                        {commande.statut === 'prete' && (
                          <div className="text-green-600 text-sm font-medium flex items-center justify-center flex-1">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            Terminée
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}

                {groupByStatus(status).length === 0 && (
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

export default KitchenBoard