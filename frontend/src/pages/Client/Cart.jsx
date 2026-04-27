import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Layout/Navbar'
import Button from '../../components/Common/Button'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'

const Cart = () => {
  const [cart, setCart] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    loadCart()
    const handleCartUpdate = () => loadCart()
    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(cartData)
  }

  const updateQuantity = (platId, delta) => {
    const updatedCart = cart.map(item => {
      if (item.plat_id === platId) {
        return { ...item, quantite: Math.max(1, item.quantite + delta) }
      }
      return item
    })
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCart(updatedCart)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeFromCart = (platId) => {
    const updatedCart = cart.filter(item => item.plat_id !== platId)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCart(updatedCart)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.prix_unitaire * item.quantite), 0)
  }

  const handleOrder = () => {
    alert('Commande passée avec succès ! (Simulation)')
    localStorage.removeItem('cart')
    setCart([])
    navigate('/menu')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Votre Panier</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Votre panier est vide</p>
            <Button variant="primary" onClick={() => navigate('/menu')}>
              Retour au menu
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 space-y-4">
              {cart.map(item => (
                <div key={item.plat_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.nom}</h3>
                    <p className="text-gray-600">{item.prix_unitaire.toFixed(2)} €</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
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
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.plat_id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-6">
              <div className="flex justify-between mb-4">
                <span className="text-lg font-medium">Total</span>
                <span className="text-2xl font-bold text-primary-600">{calculateTotal().toFixed(2)} €</span>
              </div>
              
              <div className="flex space-x-4">
                <Button variant="gray" onClick={() => navigate('/menu')} className="flex-1">
                  Continuer les achats
                </Button>
                <Button variant="success" onClick={handleOrder} className="flex-1">
                  Commander
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart