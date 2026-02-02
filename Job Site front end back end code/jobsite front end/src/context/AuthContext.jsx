// Authentication context
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth.api';
import { mapBackendRoleToFrontend } from '../utils/helpers';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from API
  const fetchUserData = async () => {
    console.debug('[AuthContext] Fetching fresh user data...');
    try {
      const response = await authAPI.getCurrentUser();
      const userData = response.data;
      console.debug('[AuthContext] User data received:', userData);
      
      // Map backend role to frontend role
      const mappedUser = {
        ...userData,
        role: mapBackendRoleToFrontend(userData.role),
      };
      
      localStorage.setItem('user', JSON.stringify(mappedUser));
      setUser(mappedUser);
      return mappedUser;
    } catch (error) {
      console.error('[AuthContext] Failed to fetch user data:', error);
      // If token is definitely invalid (401), clear it.
      if (error.response?.status === 401) {
        console.warn('[AuthContext] 401 detected in fetchUserData, clearing session');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
      return null;
    }
  };

  useEffect(() => {
    // Initialize auth state from localStorage and verify with API
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.debug('[AuthContext] Initializing auth state. Token exists:', !!token);
    
    if (token) {
      if (userData) {
        console.debug('[AuthContext] Loading user from localStorage');
        // Set user from localStorage immediately for faster initial render
        setUser(JSON.parse(userData));
      }
      // Verify token and fetch fresh user data
      fetchUserData().finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    // Fetch user data after login
    const userData = await fetchUserData();
    return userData;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

