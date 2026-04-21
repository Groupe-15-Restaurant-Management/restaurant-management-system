import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Layout/Navbar'
import StatCard from '../../components/Common/StatCard'
import { Euro, ShoppingCart, Users, Star } from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    commandes: 0,
    clients: 0,
    noteMoyenne: 4.5
  })

  useEffect(() => {
    // Simulation de données - à remplacer par un appel API
    setStats({
      revenue: 1234.56,
      commandes: 42,
      clients: 28,
      noteMoyenne: 4.7
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="mt-2 text-gray-600">Vue d'ensemble de l'activité du restaurant</p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Chiffre d'affaire"
            value={`${stats.revenue.toFixed(2)} €`}
            icon={Euro}
            trend={12}
            color="green"
          />
          <StatCard
            title="Commandes"
            value={stats.commandes}
            icon={ShoppingCart}
            trend={8}
            color="blue"
          />
          <StatCard
            title="Clients"
            value={stats.clients}
            icon={Users}
            trend={5}
            color="primary"
          />
          <StatCard
            title="Note moyenne"
            value={stats.noteMoyenne}
            icon={Star}
            color="secondary"
          />
        </div>

        {/* Section principale : Commandes récentes + Top Produits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Commandes récentes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Commandes récentes</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((order) => (
                <div 
                  key={order} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">Commande #{1000 + order}</p>
                    <p className="text-sm text-gray-600">Table {order} • Il y a {order * 15} min</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Terminée
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Produits */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Produits</h2>
            <div className="space-y-3">
              {[
                { nom: 'Burger Gourmet', ventes: 45 },
                { nom: 'Pizza Margherita', ventes: 38 },
                { nom: 'Salade César', ventes: 32 },
                { nom: 'Pâtes Carbonara', ventes: 28 },
                { nom: 'Tiramisu', ventes: 25 },
              ].map((plat, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                      {idx + 1}
                    </span>
                    <span className="text-gray-900 font-medium">{plat.nom}</span>
                  </div>
                  <span className="font-medium text-gray-600">{plat.ventes} ventes</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard