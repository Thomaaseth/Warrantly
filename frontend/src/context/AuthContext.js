// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, signup } from '@/lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for token in localStorage and validate it
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token with your API
      // If valid, setUser
    }
  }, []);

  const loginUser = async (credentials) => {
    const data = await login(credentials);
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };

  const signupUser = async (userData) => {
    const data = await signup(userData);
    setUser(data.user);
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, signupUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);