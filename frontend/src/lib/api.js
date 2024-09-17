import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005',
    withCredentials: true,
});

export const signup = async (userData) => {
    try {
        const response = await api.post('/auth/signup', userData);
        console.log('Signup response: ', response)
        return response.data;
    } catch (error) {
        console.log('Signup error: ', error.response || error);
        if (error.response) {
            throw error.response.data;
        } else {
            throw { message: 'An unexpected error occured.'}
        }
    };
};

export const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response || error);
      if (error.response) {
        throw error.response.data;
      } else {
        throw { message: 'An unexpected error occurred' };
      }
    };
}