import React, { useState, useEffect } from 'react'
import deliveryService from '../../services/deliveryService'
import { Phone, MapPin, Clock, CheckCircle, Truck } from 'lucide-react'

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDeliveries()
    const interval = setInterval(loadDeliveries, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadDeliveries = async () => {
    try {
      const res = await deliveryService.getMyDeliveries()
      setDeliveries(res.data)
    } catch(e) { console.error(e) } finally { setLoading(false) }
  }

  const updateStatus = async (id, status) => {
    await deliveryService.updateStatus(id, status)
    loadDeliveries()
  }

  if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div></div>

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold">Mes Livraisons</h2>
          {deliveries.map(d => (
            <div key={d.id} className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-900">#{d.commande_id}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${d.statut === 'livree' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{d.statut.replace('_', ' ')}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1 truncate"><MapPin className="w-3 h-3 inline mr-1"/>{d.adresse}</p>
              <p className="text-sm text-gray-500 mb-3"><Clock className="w-3 h-3 inline mr-1"/> ETA: {new Date(d.date_livraison_prevue).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
              <div className="flex gap-2">
                <a href={`tel:${d.livreur?.telephone || '0100000000'}`} className="flex-1 bg-blue-500 text-white text-center py-1 rounded text-sm hover:bg-blue-600"><Phone className="w-3 h-3 inline mr-1"/> Appeler</a>
                {d.statut === 'en_attente' && <button onClick={() => updateStatus(d.id, 'en_cours')} className="flex-1 bg-green-600 text-white py-1 rounded text-sm hover:bg-green-700"><Truck className="w-3 h-3 inline mr-1"/> En route</button>}
                {d.statut === 'en_cours' && <button onClick={() => updateStatus(d.id, 'livree')} className="flex-1 bg-green-600 text-white py-1 rounded text-sm hover:bg-green-700"><CheckCircle className="w-3 h-3 inline mr-1"/> Livré</button>}
              </div>
            </div>
          ))}
        </div>

        {/* Carte & Suivi */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Suivi en temps réel</h2>
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4">
            <span className="text-gray-500">🗺️ Carte Interactive (Mapbox/Leaflet Placeholder)</span>
          </div>
          <div className="flex justify-between text-center text-sm">
            {['en_attente', 'en_cours', 'livree'].map((step, idx) => (
              <div key={step} className="flex-1">
                <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center font-bold ${idx === 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>{idx + 1}</div>
                <p className="capitalize">{step.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default DeliveryList