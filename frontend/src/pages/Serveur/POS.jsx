import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import menuService from '../../services/menuService'
import orderService from '../../services/orderService'
import tableService from '../../services/tableService'
import Navbar from '../../components/Layout/Navbar'
import Button from '../../components/Common/Button'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react'

const POS = () => {
  const { tableId } = useParams()
  const navigate = useNavigate()
  const [table, setTable] = useState(null)
  const [plats, setPlats] = useState([])
  const [panier, setPanier] = useState([])
  const [categorie, setCategorie] = useState('all')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [tableId])

  const loadData = async () => {
    try {
      const [tableData, platsData] = await Promise.all([
        tableService.getTable(tableId),
        menuService.getPlats()
      ])
      setTable(tableData)
      setPlats(platsData)
    } catch (error) {
      console.error('Error loading ', error)
    } finally {
      setLoading(false)
    }
  }

  const addToPanier = (plat) => {
    const existingItem = panier.find(item => item.plat_id === plat.id)
    
    if (existingItem) {
      setPanier(panier.map(item =>
        item.plat_id === plat.id
          ? { ...item, quantite: item.quantite + 1 }
          : item
      ))
    } else {
      setPanier([...panier, {
        plat_id: plat.id,
        nom: plat.nom,
        prix_unitaire: plat.prix,
        quantite: 1
      }])
    }
  }

  const removeFromPanier = (platId) => {
    setPanier(panier.filter(item => item.plat_id !== platId))
  }

  const updateQuantity = (platId, delta) => {
    setPanier(panier.map(item => {
      if (item.plat_id === platId) {
        const newQuantity = Math.max(1, item.quantite + delta)
        return { ...item, quantite: newQuantity }
      }
      return item
    }))
  }

  const calculateTotal = () => {
    return panier.reduce((total, item) => total + (item.prix_unitaire * item.quantite), 0)
  }

  const handleSubmit = async () => {
    if (panier.length === 0) {
      alert('Le panier est vide')
      return
    }

    setSubmitting(true)
    try {
      await orderService.createCommande({
        table_id: parseInt(tableId),
        notes: notes,
        lignes: panier.map(item => ({
          plat_id: item.plat_id,
          quantite: item.quantite,
          prix_unitaire: item.prix_unitaire
        }))
      })
      
      alert('Commande envoyée en cuisine avec succès !')
      navigate('/serveur/tables')
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Erreur lors de la création de la commande')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredPlats = categorie === 'all' 
    ? plats 
    : plats.filter(p => p.categorie === categorie)

  const categories = ['all', 'entree', 'plat_principal', 'dessert', 'boisson']

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
          <div className="flex items-center space-x-4">
            <Button variant="gray" onClick={() => navigate('/serveur/tables')}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Table {table?.numero}</h1>
              <p className="text-gray-600">Prendre une commande</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex space-x-2 overflow-x-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategorie(cat)}
                    className={`
                      px-4 py-2 rounded-lg font-medium whitespace-nowrap
                      ${categorie === cat 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                    `}
                  >
                    {cat === 'all' && 'Tous'}
                    {cat === 'entree' && 'Entrées'}
                    {cat === 'plat_principal' && 'Plats Principaux'}
                    {cat === 'dessert' && 'Desserts'}
                    {cat === 'boisson' && 'Boissons'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPlats.map(plat => (
                <div key={plat.id} className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-bold text-lg text-gray-900">{plat.nom}</h3>
                  <p className="text-gray-600 text-sm mt-1">{plat.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-primary-600">{plat.prix.toFixed(2)} €</span>
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={() => addToPanier(plat)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panier */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Panier
              </h2>
              <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm font-medium">
                {panier.reduce((sum, item) => sum + item.quantite, 0)} articles
              </span>
            </div>

            {panier.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Panier vide</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {panier.map(item => (
                    <div key={item.plat_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.nom}</p>
                        <p className="text-sm text-gray-600">{item.prix_unitaire.toFixed(2)} €</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.plat_id, -1)}
                          className="p-1 rounded hover:bg-gray-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-medium w-8 text-center">{item.quantite}</span>
                        <button
                          onClick={() => updateQuantity(item.plat_id, 1)}
                          className="p-1 rounded hover:bg-gray-200"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFromPanier(item.plat_id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-medium">{calculateTotal().toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">TVA (20%)</span>
                    <span className="font-medium">{(calculateTotal() * 0.2).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t">
                    <span>Total</span>
                    <span className="text-primary-600">{(calculateTotal() * 1.2).toFixed(2)} €</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes pour la cuisine
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    rows="2"
                    placeholder="Ex: Sans oignons, bien cuit..."
                  />
                </div>

                <Button
                  variant="success"
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={submitting || panier.length === 0}
                >
                  {submitting ? 'Envoi...' : 'Envoyer en cuisine'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default POS