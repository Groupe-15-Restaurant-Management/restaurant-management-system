import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import tableService from '../../services/tableService'
import Navbar from '../../components/Layout/Navbar'
import { Users } from 'lucide-react'

const Tables = () => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)  // ✅ Nouvel état pour les erreurs
  const navigate = useNavigate()

  useEffect(() => {
    loadTables()
  }, [])

  const loadTables = async () => {
    try {
      const data = await tableService.getTables()
      setTables(data)
      setError(null)  // ✅ Reset erreur si succès
    } catch (error) {
      console.error('Error loading tables:', error)
      // ✅ Afficher l'erreur à l'utilisateur
      if (error.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.')
      } else {
        setError('Impossible de charger les tables. Réessayez.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTableClick = (table) => {
    if (table.statut === 'libre') {
      navigate(`/serveur/pos/${table.id}`)
    }
  }

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'libre': return 'bg-green-100 border-green-400 hover:bg-green-200'
      case 'occupee': return 'bg-gray-200 border-gray-400 cursor-not-allowed'
      case 'reservee': return 'bg-orange-100 border-orange-400'
      default: return 'bg-gray-100 border-gray-300'
    }
  }

  const getStatusText = (statut) => {
    switch (statut) {
      case 'libre': return 'Libre'
      case 'occupee': return 'Occupée'
      case 'reservee': return 'Réservée'
      default: return statut
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tables</h1>
          <p className="mt-2 text-gray-600">Sélectionnez une table libre pour prendre une commande</p>
        </div>

        {/* ✅ Affichage des erreurs */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
            <button 
              onClick={() => window.location.href = '/login'}
              className="ml-4 underline font-medium"
            >
              Se reconnecter
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map((table) => (
            <div
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-200
                ${getStatusColor(table.statut)}
                ${table.statut === 'libre' ? 'cursor-pointer transform hover:scale-105' : ''}
              `}
            >
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {table.numero}
                </div>
                <div className="flex items-center space-x-1 text-gray-700 mb-3">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">{table.capacite} pers.</span>
                </div>
                <div className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${table.statut === 'libre' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}
                `}>
                  {getStatusText(table.statut)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {tables.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune table disponible</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tables