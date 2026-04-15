import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // ← Correction import

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth(); // ← Ajout de loading
  
  // Ne pas afficher la sidebar pendant le chargement
  if (loading) {
    return (
      <aside className="w-64 bg-gradient-to-b from-purple-800 to-purple-900 min-h-screen">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </aside>
    );
  }
  
  // Ne pas afficher la sidebar si pas d'utilisateur
  if (!user) {
    return null;
  }
  
  const userRole = user?.role || 'admin';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const adminMenuItems = [
    {
      section: 'Principal',
      items: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/analytics', label: 'Analytiques', icon: '📈' }
      ]
    },
    {
      section: 'Gestion',
      items: [
        { path: '/admin/users', label: 'Utilisateurs', icon: '👥' },
        { path: '/admin/plats', label: 'Menu / Plats', icon: '🍽️' },
        { path: '/admin/commandes', label: 'Commandes', icon: '📦' },
        { path: '/admin/stock', label: 'Stock', icon: '📦' },
        { path: '/admin/livraisons', label: 'Livraisons', icon: '🚚' },
        { path: '/admin/reservations', label: 'Réservations', icon: '📅' }
      ]
    },
    {
      section: 'Finances',
      items: [
        { path: '/admin/paiements', label: 'Paiements', icon: '💰' },
        { path: '/admin/factures', label: 'Factures', icon: '📄' },
        { path: '/admin/rapports', label: 'Rapports', icon: '📋' }
      ]
    },
    {
      section: 'Configuration',
      items: [
        { path: '/admin/settings', label: 'Paramètres', icon: '⚙️' }
      ]
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={`bg-gradient-to-b from-purple-800 to-purple-900 dark:from-gray-800 dark:to-gray-900 text-white transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } min-h-screen flex flex-col shadow-xl`}
    >
      {/* Logo section */}
      <div className="p-4 border-b border-white/20 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-purple-800 text-lg">
              🍽️
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          aria-label={isCollapsed ? 'Développer' : 'Réduire'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {adminMenuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200
                      ${active 
                        ? 'bg-white/20 text-white shadow-lg' 
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    title={isCollapsed ? item.label : ''}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer section */}
      <div className="p-4 border-t border-white/20">
        <Link
          to="/"
          className={`
            flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors mb-2
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <span>🏠</span>
          {!isCollapsed && <span>Retour site</span>}
        </Link>
        
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-red-200
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <span>🚪</span>
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;