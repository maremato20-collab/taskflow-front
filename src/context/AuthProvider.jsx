import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext'; 
import { apiFetch } from "../services/api";

const TOKEN_KEY = 'token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
    
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

 
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

 
      const receivedToken = response.data?.token || response.token;
      const receivedUser = response.data?.user || response.user;

      localStorage.setItem(TOKEN_KEY, receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
    } finally {
      setIsLoading(false);
    }
  };

  // Registrarse y autenticar automáticamente
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
    
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };


  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };


  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}