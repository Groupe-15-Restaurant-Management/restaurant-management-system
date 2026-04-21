import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Utensils, LogOut, User, Users, FileText, Settings, LayoutDashboard, ShoppingCart, Table, Calendar, ChefHat, CreditCard, Package, Truck, ShoppingBagIcon } from 'lucide-react'
import Button from '../Common/Button'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/admin/users', label: 'Utilisateurs', icon: Users },
          { path: '/admin/reports', label: 'Rapports', icon: FileText },
          { path: '/admin/settings', label: 'Paramètres', icon: Settings },
        ]
      
      case 'serveur':
        return [
          { path: '/serveur/tables', label: 'Tables', icon: Table },
          { path: '/menu', label: 'Menu', icon: ShoppingCart },
          { path: '/serveur/reservations', label: 'Réservations', icon: Calendar },
          { path: '/serveur/ReservationForm', label: 'Client rapide', icon: ShoppingBagIcon },
        ]
      
      case 'cuisinier':
        return [
          { path: '/kitchen', label: 'Cuisine', icon: ChefHat },
        ]
      
      case 'caissier':
        return [
          { path: '/payments', label: 'Paiements', icon: CreditCard },
        ]
      
      case 'magasinier':
        return [
          { path: '/stock', label: 'Stock', icon: Package },
        ]
      
      case 'livreur':
        return [
          { path: '/deliveries', label: 'Livraisons', icon: Truck },
        ]
      
      case 'client':
        return [
          { path: '/menu', label: 'Menu', icon: ShoppingCart },
          { path: '/reservation', label: 'Réservation', icon: Calendar },
        ]
      
      default:
        return []
    }
  }

  const menuItems = getMenuItems()

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Utensils className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Restaurant</span>
            </Link>
            
            {menuItems.length > 0 && (
              <div className="hidden md:flex ml-10 space-x-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">{user?.nom}</span>
              <span className="text-xs text-gray-500">({user?.role})</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar