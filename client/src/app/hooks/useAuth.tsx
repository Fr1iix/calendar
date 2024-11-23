import { useState, useEffect } from 'react';

// Хук useAuth для управления состоянием авторизации
export function useAuth() {
    const [user, setUser] = useState<{
        token?: string;
        firstName?: string;
        email?: string;
        role?: string;
    } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    const login = (userData: any) => {
        setUser(userData);
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return { user, login, logout };
}