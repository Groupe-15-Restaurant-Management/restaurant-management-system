import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import useCart from '../../hooks/useCart';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-main py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-8 text-center">
            <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Votre panier est vide
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Ajoutez des plats à votre panier pour passer commande
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Voir le menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-main py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Mon Panier</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Liste des articles */}
          <div className="flex-1">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold">Articles ({cart.length})</h2>
              </div>
              
              {cart.map((item) => (
                <div key={item.id} className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.nom} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Infos */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white">{item.nom}</h3>
                      <p className="text-primary font-bold">{item.prix.toFixed(2)} €</p>
                    </div>
                    
                    {/* Quantité */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantite - 1)}
                        className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantite}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantite + 1)}
                        className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Prix total */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {(item.prix * item.quantite).toFixed(2)} €
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={clearCart}
              className="mt-4 text-red-500 hover:text-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Vider le panier
            </button>
          </div>
          
          {/* Résumé */}
          <div className="lg:w-96">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Résumé de la commande</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{getCartTotal().toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span>2.50 €</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">{(getCartTotal() + 2.5).toFixed(2)} €</span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition font-semibold">
                Passer la commande
              </button>
              
              <Link to="/menu" className="block text-center text-gray-500 hover:text-primary mt-4">
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;