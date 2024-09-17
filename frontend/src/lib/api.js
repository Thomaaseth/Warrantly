import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005',
    withCredentials: true,
});

export const signup = async (userData) => {
  try {
      const response = await api.post('/auth/signup', userData);
      console.log('Signup response: ', response);
      return response.data;
  } catch (error) {
      console.log('Signup error: ', error.response || error);
      if (error.response && error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
      } else {
          throw new Error('An unexpected error occurred');
      }
  }
};

export const login = async (credentials) => {
  try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
  } catch (error) {
      console.error('Login error:', error.response || error);
      if (error.response && error.response.data) {
          throw error.response.data;
      } else {
          throw { message: 'An unexpected error occurred' };
      }
  }
};