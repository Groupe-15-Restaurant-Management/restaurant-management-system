import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')"
            }}>
                <div className="w-full h-full bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-white text-center p-8">
                        <h1 className="text-5xl font-bold mb-4">Bienvenue</h1>
                        <p className="text-xl">Découvrez une expérience culinaire exceptionnelle</p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <svg className="w-16 h-16 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C10.5 2 9.5 3.5 9.5 5C9.5 6.5 10.5 8 12 8C13.5 8 14.5 6.5 14.5 5C14.5 3.5 13.5 2 12 2ZM12 10C9 10 7 11.5 7 14C7 16.5 9 18 12 18C15 18 17 16.5 17 14C17 11.5 15 10 12 10ZM12 20C8 20 5 18.5 5 16V18C5 20.5 8 22 12 22C16 22 19 20.5 19 18V16C19 18.5 16 20 12 20Z"/>
                            </svg>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                            Connexion
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                    placeholder="votre@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mot de passe
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                    <span className="text-gray-600">Se souvenir de moi</span>
                                </label>
                                <Link to="/forgot-password" className="text-orange-600 hover:text-orange-700 font-medium">
                                    Mot de passe oublié?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Connexion en cours...' : 'Se connecter'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Pas encore de compte?{' '}
                                <Link to="/register" className="text-orange-600 hover:text-orange-700 font-medium">
                                    Créer un compte
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;