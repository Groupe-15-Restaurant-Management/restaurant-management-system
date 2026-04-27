import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import menuService from '../../services/menuService'
import Navbar from '../../components/Layout/Navbar'
import Button from '../../components/Common/Button'
import { ShoppingCart, Star } from 'lucide-react'

const Menu = () => {
  const [plats, setPlats] = useState([])
  const [categorie, setCategorie] = useState('all')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadPlats()
  }, [])

  const loadPlats = async () => {
    try {
      const data = await menuService.getPlats()
      setPlats(data)
    } catch (error) {
      console.error('Error loading menu:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (plat) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(item => item.plat_id === plat.id)
    
    if (existingItem) {
      existingItem.quantite += 1
    } else {
      cart.push({
        plat_id: plat.id,
        nom: plat.nom,
        prix_unitaire: plat.prix,
        quantite: 1
      })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'entree', label: 'Entrées' },
    { id: 'plat_principal', label: 'Plats Principaux' },
    { id: 'dessert', label: 'Desserts' },
    { id: 'boisson', label: 'Boissons' }
  ]

  const filteredPlats = categorie === 'all' 
    ? plats 
    : plats.filter(p => p.categorie === categorie)

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
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Notre Menu</h1>
          <p className="text-lg text-gray-600">Découvrez nos plats faits maison</p>
        </div>

        <div className="flex justify-center space-x-2 mb-8 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategorie(cat.id)}
              className={`
                px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors
                ${categorie === cat.id 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'}
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlats.map(plat => (
            <div key={plat.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <span className="text-6xl">🍽️</span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{plat.nom}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.5</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{plat.description}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">{plat.prix.toFixed(2)} €</span>
                    <span className="text-xs text-gray-500 ml-1">/ plat</span>
                  </div>
                  
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => addToCart(plat)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-6 right-6">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/cart')}
            className="shadow-lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Voir le panier
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Menu