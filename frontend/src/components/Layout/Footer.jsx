import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Pas de appel à useAuth() ici - c'est bien !
  // Le Footer est statique, pas de risque de boucle

  return (
    <footer className="bg-gray-900 dark:bg-gray-900 text-white mt-auto">
      {/* Newsletter section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-1">Recevez nos offres spéciales</h3>
              <p className="text-gray-400 text-sm">Inscrivez-vous à notre newsletter</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 md:w-64 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors font-semibold">
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Colonne 1 - Restaurant info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-lg">
                🍽️
              </div>
              <span className="text-xl font-bold">RestaurantManager</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Gérez votre restaurant facilement avec notre solution tout-en-un.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-orange-500 transition-colors">
                📘
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-orange-500 transition-colors">
                🐦
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-orange-500 transition-colors">
                📷
              </a>
            </div>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/menu" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Notre menu
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Réservation
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-orange-500 transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 - Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="text-orange-500 text-lg">📍</span>
                <span className="text-gray-400 text-sm">123 Avenue du Restaurant, Dakar, Sénégal</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-orange-500">📞</span>
                <span className="text-gray-400">+221 33 123 45 67</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-orange-500">✉️</span>
                <span className="text-gray-400">contact@restaurantmanager.com</span>
              </li>
            </ul>
          </div>

          {/* Colonne 4 - Horaires */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Horaires</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-3">
                <span className="text-orange-500">🕐</span>
                <div>
                  <p className="text-gray-400">Lundi - Vendredi</p>
                  <p className="text-sm">11:00 - 22:00</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-orange-500">🕐</span>
                <div>
                  <p className="text-gray-400">Samedi - Dimanche</p>
                  <p className="text-sm">10:00 - 23:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Paiements sécurisés */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">🛡️</span>
              <span className="text-gray-400 text-sm">Paiements 100% sécurisés</span>
            </div>
            <div className="flex space-x-4 text-2xl">
              <span>💳</span>
              <span className="text-blue-600">💙</span>
              <span className="text-red-600">❤️</span>
              <span>🚚</span>
            </div>
            <p className="text-gray-500 text-sm">
              © {currentYear} RestaurantManager. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;