"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, signup } from '@/lib/api';
import { toast } from 'react-toastify';
import { TOAST_MESSAGES } from '@/utils/toastMessage';

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
      setUser(JSON.parse(localStorage.getItem('userData')));
    }
  }, []);

  const loginUser = async (loginData) => {
    try {
      // loginData should already contain the user and authToken from the API response
      const { user, authToken } = loginData;
      setUser(user);
      localStorage.setItem('token', authToken);
      localStorage.setItem('userData', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Error in loginUser:', error);
      throw error;
    }
  };

  const signupUser = async (userData) => {
    try {
      const data = await signup(userData);
      console.log('Signup successful, user data:', data.user);
      return data.user;
    } catch (error) {
      console.error('Signup error:', error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out, clearing user data');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    toast.success(TOAST_MESSAGES.LOGOUT_SUCCESS);
  };

  console.log('Current user state:', user);

  return (
    <AuthContext.Provider value={{ user, loginUser, signupUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);