import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * Composant de protection de route
 * @param {Object} children - Composant à rendre si autorisé
 * @param {string[]} allowedRoles - Rôles autorisés (ex: ['admin', 'serveur'])
 * @param {string} redirectTo - Route de redirection si non autorisé (default: '/login')
 */
export const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  // Pendant le chargement de l'auth, afficher un spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // Si pas d'utilisateur, rediriger vers login en sauvegardant la route demandée
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Si l'utilisateur n'a pas le rôle requis
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Rediriger vers la page par défaut de son rôle
    const roleRedirects = {
      admin: '/admin/dashboard',
      serveur: '/serveur/tables',
      cuisinier: '/kitchen',
      caissier: '/payments',
      livreur: '/deliveries',
      magasinier: '/stock'
    }
    return <Navigate to={roleRedirects[user.role] || '/login'} replace />
  }

  // Accès autorisé → rendre le composant
  return children
}