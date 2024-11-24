import { useState, useEffect } from 'react';

export function useAuth() {
    const [user, setUser] = useState<any | null>(null);  // Начальное значение - null

    // Эффект для загрузки данных пользователя после монтирования компонента
    useEffect(() => {
        if (typeof window !== "undefined") {  // Проверка, что код выполняется в браузере
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (token && storedUser) {
                setUser(JSON.parse(storedUser)); // Устанавливаем состояние пользователя
            }
        }
    }, []); // Пустой массив зависимостей, выполняется только один раз при монтировании

    const login = (userData: any) => {
        if (typeof window !== "undefined") {  // Проверка, что код выполняется в браузере
            setUser(userData);
            localStorage.setItem('token', userData.token);
            localStorage.setItem('user', JSON.stringify(userData));
        }
    };

    const logout = () => {
        if (typeof window !== "undefined") {  // Проверка, что код выполняется в браузере
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    return { user, login, logout };
}
