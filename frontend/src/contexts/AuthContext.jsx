import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status on app load
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URI}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Auth check failed:', error);
            // Token is invalid or expired
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URI}/auth/login`, { 
                email, 
                password 
            });
            const { token } = response.data;
            
            localStorage.setItem('token', token);
            
            // Fetch user data after successful login
            const userResponse = await axios.get(`${process.env.REACT_APP_API_URI}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setUser(userResponse.data);
            setIsAuthenticated(true);
            
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            return { success: false, message };
        }
    };

    const signup = async (username, email, password) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URI}/auth/signup`, { 
                username, 
                email, 
                password 
            });
            return { success: true, message: 'Account created successfully! Please login.' };
        } catch (error) {
            console.error('Signup failed:', error);
            const message = error.response?.data?.message || 'Signup failed. Please try again.';
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateProfile = async (userData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${process.env.REACT_APP_API_URI}/auth/profile`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            return { success: true, message: 'Profile updated successfully!' };
        } catch (error) {
            console.error('Profile update failed:', error);
            const message = error.response?.data?.message || 'Profile update failed. Please try again.';
            return { success: false, message };
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 