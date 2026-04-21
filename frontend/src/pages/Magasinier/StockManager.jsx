import React, { useState, useEffect } from 'react'
import stockService from '../../services/stockService'
import { Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react'

const StockManager = () => {
  const [stocks, setStocks] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [s, a] = await Promise.all([stockService.getAll(), stockService.getAlerts()])
      setStocks(s.data)
      setAlerts(a.data)
    } catch(e) { console.error(e) } finally { setLoading(false) }
  }

  if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div></div>

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gestion de Stock</h1>
        
        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl flex items-center"><Package className="w-8 h-8 text-blue-600 mr-3"/><div><p className="text-sm text-gray-600">Total articles</p><p className="text-2xl font-bold">{stocks.length}</p></div></div>
          <div className="bg-orange-50 p-4 rounded-xl flex items-center"><AlertTriangle className="w-8 h-8 text-orange-600 mr-3"/><div><p className="text-sm text-gray-600">Stock faible</p><p className="text-2xl font-bold">{alerts.length}</p></div></div>
          <div className="bg-red-50 p-4 rounded-xl flex items-center"><AlertTriangle className="w-8 h-8 text-red-600 mr-3"/><div><p className="text-sm text-gray-600">Rupture</p><p className="text-2xl font-bold">{stocks.filter(s=>s.quantite===0).length}</p></div></div>
          <div className="bg-green-50 p-4 rounded-xl flex items-center"><DollarSign className="w-8 h-8 text-green-600 mr-3"/><div><p className="text-sm text-gray-600">Valeur estimée</p><p className="text-2xl font-bold">€{(stocks.reduce((a,b)=>a+b.quantite*5,0)).toFixed(0)}</p></div></div>
        </div>

        {/* Alertes */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="font-bold mb-3 flex items-center"><AlertTriangle className="w-5 h-5 text-red-500 mr-2"/> Alertes Urgentes</h2>
          {alerts.length === 0 ? <p className="text-gray-500 text-sm">Aucune alerte</p> : (
            alerts.map(a => (
              <div key={a.id} className="mb-2 p-2 bg-red-50 rounded border-l-4 border-red-500 flex justify-between items-center">
                <span className="font-medium">{a.nom_ingredient}</span>
                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{width: `${Math.min((a.quantite/a.seuil_min)*100, 100)}%`}}></div>
                </div>
                <span className="text-xs text-red-700">{a.quantite} / {a.seuil_min} {a.unite}</span>
              </div>
            ))
          )}
        </div>

        {/* Inventaire */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-bold">Inventaire</h2>
            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">+ Ajouter</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 uppercase">
                <tr><th className="p-3">Produit</th><th className="p-3">Qté</th><th className="p-3">Seuil</th><th className="p-3">Statut</th></tr>
              </thead>
              <tbody>
                {stocks.map(s => {
                  const ratio = s.quantite / s.seuil_min
                  const statusColor = s.quantite === 0 ? 'bg-red-100 text-red-800' : ratio < 1 ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                  const statusText = s.quantite === 0 ? 'Rupture' : ratio < 1 ? 'Faible' : 'OK'
                  return (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{s.nom_ingredient}</td>
                      <td className="p-3">{s.quantite} {s.unite}</td>
                      <td className="p-3">{s.seuil_min} {s.unite}</td>
                      <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor}`}>{statusText}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
export default StockManager