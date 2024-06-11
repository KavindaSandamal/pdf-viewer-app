import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedUser = jwtDecode(token);
            setAuthData({ ...decodedUser, token });
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        const decodedUser = jwtDecode(userData.token);
        setAuthData({ ...decodedUser, token: userData.token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthData(null);
    };

    return (
        <AuthContext.Provider value={{ authData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
