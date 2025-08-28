import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set axios default base URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  axios.defaults.baseURL = `${backendUrl}/api`;

  // Add token to axios headers if it exists
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Set loading to false after initial token check
  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/user/login', { email, password });
      
      if (response.data.success) {
        if (response.data.needsVerification) {
          // Email needs verification
          setToken(null);
          setUser(null);
          toast.info('Please verify your email address before logging in');
          return { 
            success: false, 
            message: 'Please verify your email address before logging in',
            needsVerification: true,
            email: email // Add email to response
          };
        }
        
        // Login successful with verified email
        setToken(response.data.token);
        setUser(response.data.user);
        toast.success('Login successful!');
        return { success: true };
      } else {
        // Handle specific error messages
        const errorMessage = response.data.message;
        if (errorMessage === 'Token expired. Please login again.' ||
            errorMessage === 'Invalid token format.' ||
            errorMessage === 'Invalid token.') {
          setToken(null);
          setUser(null);
          toast.error('Session expired. Please login again.');
        } else if (errorMessage === 'Please verify your email address before logging in') {
          setToken(null);
          setUser(null);
          toast.info('Please verify your email address before logging in');
          return { 
            success: false, 
            message: errorMessage, 
            needsVerification: true,
            email: email // Add email to response
          };
        } else {
          toast.error(errorMessage || 'Login failed');
        }
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/user/register', { name, email, password });
      
      if (response.data.success) {
        if (response.data.needsVerification) {
          // Registration successful but needs email verification
          setToken(response.data.token);
          setUser(response.data.user);
          toast.info(response.data.message || 'Registration successful! Please check your email for verification code');
          return { 
            success: true,
            needsVerification: true,
            message: response.data.message,
            email: email // Return email for verification page
          };
        }
        
        // Registration successful with immediate login (if email already verified)
        setToken(response.data.token);
        setUser(response.data.user);
        toast.success('Registration successful!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Registration failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return { success: false, message: 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('Logout function called');
    setToken(null);
    setUser(null);
    
    // Clear cart from localStorage (will be synced when user logs back in)
    console.log('Clearing cart from localStorage');
    localStorage.removeItem('cartItems');
    
    // Clear axios authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    toast.success('Logged out successfully');
  };

  const isAuthenticated = !!token;
  
  // Debug logging
  console.log('🔐 AuthContext state:', { 
    hasToken: !!token, 
    isAuthenticated, 
    loading, 
    hasUser: !!user 
  });

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
