import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await fetch('http://localhost:8000/api/auth/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            let message = error.detail || 'Login failed';
            if (typeof error === 'object' && !error.detail) {
                const firstKey = Object.keys(error)[0];
                if (Array.isArray(error[firstKey])) {
                    message = error[firstKey][0];
                } else if (typeof error[firstKey] === 'string') {
                    message = error[firstKey];
                }
            }
            throw new Error(message);
        }

        const data = await response.json();
        const access = data.access;

        // Fetch profile to get full name etc.
        const profileRes = await fetch('http://localhost:8000/api/auth/profile/', {
            headers: { 'Authorization': `Bearer ${access}` },
        });

        const userData = await profileRes.json();

        localStorage.setItem('token', access);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const ownerLogin = async (email, password) => {
        const response = await fetch('http://localhost:8000/api/auth/owner/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            // Handle DRF nested error messages
            let message = error.detail || 'Owner login failed';
            if (typeof error === 'object' && !error.detail) {
                // Check for non_field_errors or other keys
                const firstKey = Object.keys(error)[0];
                if (Array.isArray(error[firstKey])) {
                    message = error[firstKey][0];
                } else if (typeof error[firstKey] === 'string') {
                    message = error[firstKey];
                }
            }
            throw new Error(message);
        }

        const data = await response.json();
        const access = data.access;

        const profileRes = await fetch('http://localhost:8000/api/auth/profile/', {
            headers: { 'Authorization': `Bearer ${access}` },
        });

        const userData = await profileRes.json();
        if (!userData.is_owner) {
            throw new Error('Unauthorized: User is not an owner');
        }

        localStorage.setItem('token', access);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const signup = async (email, full_name, password, is_owner = false) => {
        const response = await fetch('http://localhost:8000/api/auth/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, full_name, password, is_owner }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error) || 'Signup failed');
        }

        // Use correct login endpoint based on role
        if (is_owner) {
            return ownerLogin(email, password);
        }
        return login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, ownerLogin, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
