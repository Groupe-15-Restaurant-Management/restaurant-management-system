import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { cart } = useCart(); // Récupérer directement cart au lieu de getCartCount
  
  const navigate = useNavigate();
  const location = useLocation();

  // Éviter l'affichage pendant le chargement
  if (loading) {
    return (
      <nav className="bg-white dark:bg-dark-surface shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  const userRole = user?.role || 'client';
  const userName = user?.nom || 'Invité';
  
  // Calcul du nombre d'articles dans le panier
  const cartCount = cart?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
  };

  const getNavItems = () => {
    const commonItems = [
      { path: '/', label: 'Accueil', roles: ['client', 'serveur', 'cuisinier', 'caissier', 'livreur', 'magasinier', 'admin'] }
    ];

    const roleSpecificItems = {
      client: [
        { path: '/menu', label: 'Menu', roles: ['client'] },
        { path: '/reservation', label: 'Réservation', roles: ['client'] },
        { path: '/orders', label: 'Mes commandes', roles: ['client'] }
      ],
      admin: [
        { path: '/admin/dashboard', label: 'Dashboard', roles: ['admin'] },
        { path: '/admin/users', label: 'Utilisateurs', roles: ['admin'] },
        { path: '/admin/reports', label: 'Rapports', roles: ['admin'] }
      ]
    };

    let items = [...commonItems];
    
    if (userRole === 'admin') {
      items = [...items, ...roleSpecificItems.admin];
    } else if (userRole === 'client') {
      items = [...items, ...roleSpecificItems.client];
    }

    return items;
  };

  const navItems = getNavItems();

  // Ne pas afficher la navbar sur les pages d'auth
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <>
      <nav className="bg-white dark:bg-dark-surface shadow-md sticky top-0 z-50 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-lg">
                🍽️
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                Restaurant<span className="text-orange-500">Manager</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              
              {/* Panier - uniquement pour les clients */}
              {userRole === 'client' && (
                <Link 
                  to="/cart" 
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span role="img" aria-label="panier">🛒</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Mode sombre */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xl"
                aria-label="Mode sombre"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              {/* Profil utilisateur - uniquement si connecté */}
              {isAuthenticated() && (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Profil"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:block text-gray-700 dark:text-gray-300">
                      {userName}
                    </span>
                  </button>

                  {/* Dropdown menu */}
                  {isProfileOpen && (
                    <>
                      {/* Click outside to close */}
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{userName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Rôle: <span className="capitalize">{userRole}</span>
                          </p>
                          {user?.email && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{user.email}</p>
                          )}
                        </div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <span>🚪</span>
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Menu burger mobile - uniquement si connecté */}
              {isAuthenticated() && (
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-xl"
                  aria-label="Menu"
                >
                  {isOpen ? '✕' : '☰'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && isAuthenticated() && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-lg ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              {userRole === 'client' && (
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  🛒 Panier ({cartCount})
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;