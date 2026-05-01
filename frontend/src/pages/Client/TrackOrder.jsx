import React, { useState, useEffect, useCallback } from 'react'
import { useWebSocket } from '../../hooks/useWebSocket'
import { useParams } from 'react-router-dom'
import orderService from '../../services/orderService'
import { CheckCircle, Clock, Truck, Package } from 'lucide-react'

const TrackOrder = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  // WebSocket pour suivre cette commande spécifique
  useWebSocket(`order_${orderId}`, {
    status_updated: useCallback((data) => {
      // Mise à jour en temps réel du statut
      setOrder(prev => prev ? { ...prev, statut: data.new_status } : null)
    }, [orderId])
  })

  // Chargement initial de la commande
  const loadOrder = useCallback(async () => {
    try {
      const data = await orderService.getCommande(orderId)
      setOrder(data)
    } catch (error) {
      console.error('Erreur chargement commande:', error)
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    loadOrder()
  }, [loadOrder])

  // Mapping des statuts vers étapes de la timeline
  const steps = [
    { key: 'en_attente', label: 'Reçue', icon: Clock },
    { key: 'en_preparation', label: 'En préparation', icon: Package },
    { key: 'prete', label: 'Prête', icon: CheckCircle },
    { key: 'terminee', label: 'Livrée', icon: Truck }
  ]

  const getCurrentStep = useCallback(() => {
    const statusMap = {
      'en_attente': 0,
      'en_preparation': 1,
      'prete': 2,
      'terminee': 3
    }
    return statusMap[order?.statut] || 0
  }, [order?.statut])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Commande non trouvée</p>
      </div>
    )
  }

  const currentStep = getCurrentStep()

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Suivi de votre commande</h1>
          <p className="text-gray-600 mt-2">Commande #{order.id}</p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="relative">
            {/* Barre de progression */}
            <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 rounded">
              <div 
                className="h-full bg-green-600 rounded transition-all duration-300"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Étapes */}
            <div className="relative flex justify-between">
              {steps.map((step, idx) => {
                const Icon = step.icon
                const isActive = idx <= currentStep
                const isCurrent = idx === currentStep

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
                      ${isActive ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-400'}
                      ${isCurrent ? 'ring-2 ring-green-300 ring-offset-2' : ''}
                    `}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs mt-2 font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Détails de la commande */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-gray-900 mb-4">Détails</h3>
          
          {/* Items commandés */}
          <div className="space-y-3 mb-6">
            {order.lignes?.map((ligne, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="text-gray-700">
                  {ligne.quantite}x {ligne.plat?.nom}
                </span>
                <span className="font-medium text-gray-900">
                  {(ligne.prix_unitaire * ligne.quantite).toFixed(2)} €
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-green-600">{order.montant_total?.toFixed(2)} €</span>
          </div>
        </div>

        {/* Bouton de contact */}
        <div className="mt-6 text-center">
          <a 
            href="tel:+33123456789" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Truck className="w-4 h-4 mr-2" />
            Contacter le restaurant
          </a>
        </div>
      </div>
    </div>
  )
}

export default React.memo(TrackOrder)