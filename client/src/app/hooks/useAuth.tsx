import { useState, useEffect } from 'react';

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
            // Здесь можно добавить запрос на получение данных пользователя
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    const login = (userData: any) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return { user, login, logout };
}