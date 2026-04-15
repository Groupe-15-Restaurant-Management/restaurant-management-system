import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

// Export du contexte
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(authService.getToken());

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Récupérer l'utilisateur depuis localStorage d'abord
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          }
          
          // Puis vérifier avec l'API (optionnel)
          try {
            const freshUser = await authService.getCurrentUser();
            if (freshUser) {
              setUser(freshUser);
              authService.setStoredUser(freshUser);
            }
          } catch (apiError) {
            console.warn('Impossible de vérifier l\'utilisateur avec l\'API:', apiError);
            // Si l'API échoue mais qu'on a un utilisateur stocké, on le garde
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      const { access_token, user: userData } = response;
      
      setToken(access_token);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      let errorMessage = 'Email ou mot de passe incorrect';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      let errorMessage = "Erreur d'inscription";
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Version alternative avec paramètres individuels
  const registerWithParams = async (nom, email, telephone, password, role = 'client') => {
    return register({
      nom,
      email,
      telephone,
      password,
      role
    });
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return authService.isAuthenticated() && !!user;
  };

  const hasRole = (role) => {
    return authService.hasRole(role);
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    authService.setStoredUser(newUser);
  };

  const refreshUser = async () => {
    try {
      const freshUser = await authService.getCurrentUser();
      if (freshUser) {
        setUser(freshUser);
        authService.setStoredUser(freshUser);
      }
      return freshUser;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    registerWithParams,
    logout,
    isAuthenticated,
    hasRole,
    updateUser,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};