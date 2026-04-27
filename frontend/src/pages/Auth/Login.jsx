import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Utensils } from 'lucide-react'
import Button from '../../components/Common/Button'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // ✅ Appel login : NE REDIRIGE PAS, retourne juste la réponse
      await login(email, password)
      
      // ✅ La redirection est gérée par App.jsx via le ProtectedRoute
      // Mais on peut rediriger vers la page d'origine si elle existe
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
      
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <Utensils className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Restaurant Management
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous à votre compte
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Connexion...
              </span>
            ) : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-medium mb-2">Comptes de test :</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Admin: admin@restaurant.com / password123</p>
            <p>Serveur: serveur@restaurant.com / password123</p>
            <p>Cuisine: cuisine@restaurant.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login