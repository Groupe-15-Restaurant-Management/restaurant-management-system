import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/Layout/MainLayout';

// Pages Auth
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Pages Client
import Menu from './pages/Client/Menu';
import Cart from './pages/Client/Cart';
import Reservation from './pages/Client/Reservation';
import OrderHistory from './pages/Client/OrderHistory';
import TrackOrder from './pages/Client/TrackOrder';

// Pages Serveur (commentés car non créés)
// import POS from './pages/Serveur/POS';
// import Tables from './pages/Serveur/Tables';
// import OrdersList from './pages/Serveur/OrdersList';

// Pages Cuisine (commentés car non créés)
// import KitchenBoard from './pages/Cuisine/KitchenBoard';
// import PreparationHistory from './pages/Cuisine/PreparationHistory';

// Pages Caissier (commentés car non créés)
// import PaymentView from './pages/Caissier/PaymentView';
// import PaymentHistory from './pages/Caissier/PaymentHistory';

// Pages Livreur (commentés car non créés)
// import DeliveryList from './pages/Livreur/DeliveryList';
// import DeliveryHistory from './pages/Livreur/DeliveryHistory';

// Pages Magasinier (commentés car non créés)
// import StockManager from './pages/Magasinier/StockManager';
// import StockAlert from './pages/Magasinier/StockAlert';

// Pages Admin (commentés car non créés)
// import Dashboard from './pages/Admin/Dashboard';
// import UserManager from './pages/Admin/UserManager';
// import Reports from './pages/Admin/Reports';
// import Settings from './pages/Admin/Settings';

// Composant de chargement
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
      <p className="mt-4">Chargement...</p>
    </div>
  </div>
);

// Composant pour routes protégées avec vérification de rôle
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirection selon le rôle
    if (user?.role === 'client') return <Navigate to="/menu" replace />;
    if (user?.role === 'serveur') return <Navigate to="/serveur/pos" replace />;
    if (user?.role === 'cuisinier') return <Navigate to="/cuisine/board" replace />;
    if (user?.role === 'caissier') return <Navigate to="/caissier/payments" replace />;
    if (user?.role === 'livreur') return <Navigate to="/livreur/deliveries" replace />;
    if (user?.role === 'magasinier') return <Navigate to="/magasinier/stock" replace />;
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/menu" replace />;
  }
  
  return children;
};

// Composant de redirection selon le rôle
const RoleBasedRedirect = () => {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  
  switch (user?.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'client':
      return <Navigate to="/menu" replace />;
    case 'serveur':
      return <Navigate to="/serveur/pos" replace />;
    case 'cuisinier':
      return <Navigate to="/cuisine/board" replace />;
    case 'caissier':
      return <Navigate to="/caissier/payments" replace />;
    case 'livreur':
      return <Navigate to="/livreur/deliveries" replace />;
    case 'magasinier':
      return <Navigate to="/magasinier/stock" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function AppRoutes() {
  const { loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <Routes>
      {/* Routes SANS layout (pages d'authentification) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Routes AVEC layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<RoleBasedRedirect />} />
        
        {/* Routes Client */}
        <Route path="menu" element={
          <ProtectedRoute allowedRoles={['client', 'admin', 'serveur']}>
            <Menu />
          </ProtectedRoute>
        } />
        <Route path="cart" element={
          <ProtectedRoute allowedRoles={['client']}>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="reservation" element={
          <ProtectedRoute allowedRoles={['client']}>
            <Reservation />
          </ProtectedRoute>
        } />
        <Route path="orders" element={
          <ProtectedRoute allowedRoles={['client']}>
            <OrderHistory />
          </ProtectedRoute>
        } />
        <Route path="track-order/:id" element={
          <ProtectedRoute allowedRoles={['client']}>
            <TrackOrder />
          </ProtectedRoute>
        } />
        
        {/* Routes Serveur (commentées car non créées) */}
        {/* <Route path="serveur/pos" element={
          <ProtectedRoute allowedRoles={['serveur']}>
            <POS />
          </ProtectedRoute>
        } />
        <Route path="serveur/tables" element={
          <ProtectedRoute allowedRoles={['serveur']}>
            <Tables />
          </ProtectedRoute>
        } />
        <Route path="serveur/orders" element={
          <ProtectedRoute allowedRoles={['serveur']}>
            <OrdersList />
          </ProtectedRoute>
        } /> */}
        
        {/* Routes Cuisine (commentées car non créées) */}
        {/* <Route path="cuisine/board" element={
          <ProtectedRoute allowedRoles={['cuisinier']}>
            <KitchenBoard />
          </ProtectedRoute>
        } />
        <Route path="cuisine/history" element={
          <ProtectedRoute allowedRoles={['cuisinier']}>
            <PreparationHistory />
          </ProtectedRoute>
        } /> */}
        
        {/* Routes Caissier (commentées car non créées) */}
        {/* <Route path="caissier/payments" element={
          <ProtectedRoute allowedRoles={['caissier']}>
            <PaymentView />
          </ProtectedRoute>
        } />
        <Route path="caissier/history" element={
          <ProtectedRoute allowedRoles={['caissier']}>
            <PaymentHistory />
          </ProtectedRoute>
        } /> */}
        
        {/* Routes Livreur (commentées car non créées) */}
        {/* <Route path="livreur/deliveries" element={
          <ProtectedRoute allowedRoles={['livreur']}>
            <DeliveryList />
          </ProtectedRoute>
        } />
        <Route path="livreur/history" element={
          <ProtectedRoute allowedRoles={['livreur']}>
            <DeliveryHistory />
          </ProtectedRoute>
        } /> */}
        
        {/* Routes Magasinier (commentées car non créées) */}
        {/* <Route path="magasinier/stock" element={
          <ProtectedRoute allowedRoles={['magasinier']}>
            <StockManager />
          </ProtectedRoute>
        } />
        <Route path="magasinier/alerts" element={
          <ProtectedRoute allowedRoles={['magasinier']}>
            <StockAlert />
          </ProtectedRoute>
        } /> */}
        
        {/* Routes Admin (commentées car non créées) */}
        {/* <Route path="admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManager />
          </ProtectedRoute>
        } />
        <Route path="admin/reports" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="admin/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Settings />
          </ProtectedRoute>
        } /> */}
      </Route>
      
      {/* Route 404 - Page non trouvée */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;