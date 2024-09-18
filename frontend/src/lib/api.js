import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005',
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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

export const updateEmail = async (newEmail) => {
    try {
        const response = await api.put('/auth/update-email', { email: newEmail });
        console.log('Update email response:', response);
        return response.data;
    } catch (error) {
        console.error('Update email error:', error.response || error);
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { message: 'An unexpected error occurred' };
        }
    }
};

export const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await api.put('/auth/change-password', { currentPassword, newPassword });
        console.log('Change password response:', response);
        return response.data;
    } catch (error) {
        console.error('Change password error:', error.response || error);
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};

export const deleteAccount = async () => {
    try {
        const response = await api.delete('/auth/delete-account');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Products CRUD operations

export const getProducts = async () => {
    try {
        const response = await api.get('/api/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error.response || error);
        throw error.response ? error.response.data : error;
    }
};

export const createProduct = async (productData) => {
    try {
        const formData = new FormData();
        for (const key in productData) {
            formData.append(key, productData[key]);
        }
        const response = await api.post('/api/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error.response || error);
        throw error.response ? error.response.data : error;
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const formData = new FormData();
        for (const key in productData) {
            formData.append(key, productData[key]);
        }
        const response = await api.put(`/api/products/${productId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error.response || error);
        throw error.response ? error.response.data : error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await api.delete(`/api/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error.response || error);
        throw error.response ? error.response.data : error;
    }
};