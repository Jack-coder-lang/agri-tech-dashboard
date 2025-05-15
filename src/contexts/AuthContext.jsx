import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ROLES = {
    PRODUCER: 'producer',
    COOPERATIVE: 'cooperative',
    ADMIN: 'admin'
  };

  const login = async (email, password) => {
    try {
      const user = await apiLogin(email, password);
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      throw new Error('Invalid email or password');
    }
  };

  const logout = () => {
    apiLogout();
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};