import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock user roles for demonstration
  const ROLES = {
    PRODUCER: 'producer',
    COOPERATIVE: 'cooperative',
    ADMIN: 'admin'
  };

  // Mock login function - would connect to backend in production
  const login = (email, password) => {
    // Demo user data - in real app, this would come from API
    const mockUsers = {
      'producer@example.com': { 
        id: '1', 
        name: 'Jean Dupont', 
        email: 'producer@example.com', 
        role: ROLES.PRODUCER,
        farms: [
          { id: '1', name: 'Ferme du Soleil', area: 25, crops: ['Wheat', 'Corn'] }
        ] 
      },
      'coop@example.com': { 
        id: '2', 
        name: 'Marie Cooperative', 
        email: 'coop@example.com', 
        role: ROLES.COOPERATIVE,
        producers: ['1', '3', '4']
      },
      'admin@agritech.com': { 
        id: '3', 
        name: 'Admin AGRI-TECH', 
        email: 'admin@agritech.com', 
        role: ROLES.ADMIN 
      }
    };

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers[email];
        if (user && password === 'password') {
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Check if user is already logged in
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