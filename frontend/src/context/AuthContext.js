"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, signup } from '@/lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for token in localStorage and validate it
    const token = localStorage.getItem('token');
    console.log('Token in localStorage:', token);
    if (token) {
      // Validate token with your API
      // If valid, setUser
      console.log('Token found, setting user');
      setUser({ token }); // Temporary, replace with actual user data
    }
  }, []);

  const loginUser = async (credentials) => {
    try {
      const data = await login(credentials);
      console.log('Login successful, user data:', data.user);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const signupUser = async (userData) => {
    try {
      const data = await signup(userData);
      console.log('Signup successful, user data:', data.user);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const logout = () => {
    console.log('Logging out, clearing user data');
    setUser(null);
    localStorage.removeItem('token');
  };

  console.log('Current user state:', user);

  return (
    <AuthContext.Provider value={{ user, loginUser, signupUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);