import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { ProtectedRoute } from './components/Routing/ProtectedRoute' // ✅ IMPORT AJOUTÉ ICI

// Phase 1
import Login from './pages/Auth/Login'
import Tables from './pages/Serveur/Tables'
import POS from './pages/Serveur/POS'
import KitchenBoard from './pages/Cuisine/KitchenBoard'
import Menu from './pages/Client/Menu'
import Cart from './pages/Client/Cart'
import Dashboard from './pages/Admin/Dashboard'

// Phase 2
import Reservations from './pages/Serveur/Reservations'
import PaymentView from './pages/Caissier/PaymentView'
import StockManager from './pages/Magasinier/StockManager'
import DeliveryList from './pages/Livreur/DeliveryList'
import ReservationForm from './pages/Serveur/ReservationForm'

function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public / Client */}
      <Route path="/login" element={<Login />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      
      {/* Serveur */}
      <Route 
        path="/serveur/tables" 
        element={user && (user.role === 'serveur' || user.role === 'admin') ? <Tables /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/serveur/pos/:tableId" 
        element={user && (user.role === 'serveur' || user.role === 'admin') ? <POS /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/serveur/reservations" 
        element={user && (user.role === 'serveur' || user.role === 'admin') ? <Reservations /> : <Navigate to="/login" />} 
      />
      
      {/* Cuisine */}
      <Route 
        path="/kitchen" 
        element={user && (user.role === 'cuisinier' || user.role === 'admin') ? <KitchenBoard /> : <Navigate to="/login" />} 
      />
      
      {/* Admin */}
      <Route 
        path="/admin/dashboard" 
        element={user && user.role === 'admin' ? <Dashboard /> : <Navigate to="/login" />} 
      />
      
      {/* Caissier */}
      <Route 
        path="/payments" 
        element={user && (user.role === 'caissier' || user.role === 'admin') ? <PaymentView /> : <Navigate to="/login" />} 
      />

      {/* Magasinier */}
      <Route 
        path="/stock" 
        element={user && (user.role === 'magasinier' || user.role === 'admin') ? <StockManager /> : <Navigate to="/login" />} 
      />

      {/* Livreur */}
      <Route 
        path="/deliveries" 
        element={user && (user.role === 'livreur' || user.role === 'admin') ? <DeliveryList /> : <Navigate to="/login" />} 
      />
      
      {/* Redirection par défaut */}
      <Route path="/" element={
        user ? (
          user.role === 'admin' ? <Navigate to="/admin/dashboard" /> :
          user.role === 'serveur' ? <Navigate to="/serveur/tables" /> :
          user.role === 'cuisinier' ? <Navigate to="/kitchen" /> :
          user.role === 'livreur' ? <Navigate to="/deliveries" /> :
          user.role === 'caissier' ? <Navigate to="/payments" /> :
          user.role === 'magasinier' ? <Navigate to="/stock" /> :
          <Navigate to="/menu" />
        ) : <Navigate to="/login" />
      } />
      
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App