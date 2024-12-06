import { useState, useEffect } from 'react';

export function useAuth() {
    const [user, setUser] = useState<any | null>(null);  // Начальное значение - null

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (token && storedUser) {
                setUser(JSON.parse(storedUser)); // Загрузка пользователя из localStorage
            }
        }
    }, []);

    const login = (userData: any) => {
        if (typeof window !== "undefined") {
            setUser(userData);
            localStorage.setItem('token', userData.token);
            localStorage.setItem('user', JSON.stringify(userData));
        }
    };

    const logout = () => {
        if (typeof window !== "undefined") {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    return { user, login, logout };
}