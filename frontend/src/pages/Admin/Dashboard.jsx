import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import dashboardService from '../../services/dashboardService'
import StatCard from '../../components/Common/StatCard'
import { TrendingUp, AlertTriangle, Package, ShoppingCart, Clock, Truck } from 'lucide-react'

// Enregistrement des composants Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

const Dashboard = () => {
  const [kpis, setKpis] = useState(null)
  const [revenueData, setRevenueData] = useState([])
  const [popularPlats, setPopularPlats] = useState([])
  const [loading, setLoading] = useState(true)

  // Memoization des données pour éviter les re-renders inutiles
  const chartData = useMemo(() => {
    if (!revenueData.length) return null
    return {
      labels: revenueData.map(d => new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })),
      datasets: [{
        label: 'Chiffre d\'affaires (€)',
        data: revenueData.map(d => d.total),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }]
    }
  }, [revenueData])

  const popularChartData = useMemo(() => {
    if (!popularPlats.length) return null
    return {
      labels: popularPlats.map(p => p.nom),
      datasets: [{
        data: popularPlats.map(p => p.ventes),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ]
      }]
    }
  }, [popularPlats])

  // Chargement des données avec useCallback pour la stabilité
  const loadData = useCallback(async () => {
    try {
      const [kpisRes, revenueRes, popularRes] = await Promise.all([
        dashboardService.getKPIs(),
        dashboardService.getRevenueTrend(30),
        dashboardService.getPopularPlats(5)
      ])
      setKpis(kpisRes)
      setRevenueData(revenueRes)
      setPopularPlats(popularRes)
    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar simplifiée pour l'exemple */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Commandes aujourd'hui"
            value={kpis?.commandes_aujourdhui || 0}
            icon={ShoppingCart}
            color="blue"
          />
          <StatCard
            title="CA du jour"
            value={`${kpis?.ca_jour?.toFixed(2) || 0} €`}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Taux d'occupation"
            value={`${kpis?.taux_occupation || 0}%`}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Stock critique"
            value={kpis?.stock_critique || 0}
            icon={AlertTriangle}
            color="red"
          />
          <StatCard
            title="Commandes en cours"
            value={kpis?.commandes_en_cours || 0}
            icon={Package}
            color="blue"
          />
          <StatCard
            title="Livraisons en retard"
            value={kpis?.livraison_en_retard || 0}
            icon={Truck}
            color="red"
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Évolution CA */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Évolution du CA (30 jours)</h3>
            {chartData ? (
              <Line 
                data={chartData} 
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, ticks: { callback: v => `${v}€` } }
                  }
                }} 
              />
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
            )}
          </div>

          {/* Top Produits */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Plats les plus vendus</h3>
            {popularChartData ? (
              <div className="flex items-center justify-center">
                <Doughnut 
                  data={popularChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'right' } }
                  }}
                />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
            )}
          </div>
        </div>

        {/* Liste plats populaires (tableau) */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-bold text-gray-900">Détail des ventes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Plat</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Ventes</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Revenu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {popularPlats.map((plat, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{plat.nom}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{plat.ventes}</td>
                    <td className="px-4 py-3 text-right font-medium text-green-600">{plat.revenu.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// React.memo pour éviter les re-renders inutiles
export default React.memo(Dashboard)