import React, { useState } from 'react';
import styles from './AuthModal.module.css';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess: (name: string) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    // Расширенное состояние для регистрации
    const [registrationData, setRegistrationData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        middleName: '',
        phone: '',
        role: 'user'
    });

    // Состояние для входа
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // Обновление данных входа
    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Обновление данных регистрации
    const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRegistrationData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка входа');
            }

            // Сохраняем токен и данные пользователя
            localStorage.setItem('token', data.token);

            // Используем данные пользователя из ответа
            const userName = data.user?.firstName || data.user?.email || loginData.email;

            onAuthSuccess(userName);
            onClose();
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Проверка совпадения паролей
        if (registrationData.password !== registrationData.confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        try {
            const response = await fetch('/api/auth/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: registrationData.email,
                    password: registrationData.password, // ВАЖНО
                    firstName: registrationData.firstName,
                    lastName: registrationData.lastName,
                    middleName: registrationData.middleName,
                    phone: registrationData.phone,
                    role: registrationData.role
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка регистрации');
            }

            localStorage.setItem('token', data.token);
            onAuthSuccess(registrationData.firstName || registrationData.email);
            onClose();
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>×</button>

                <div className={styles.tabContainer}>
                    <button
                        className={activeTab === 'login' ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab('login')}
                    >
                        Вход
                    </button>
                    <button
                        className={activeTab === 'register' ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab('register')}
                    >
                        Регистрация
                    </button>
                </div>

                {activeTab === 'login' ? (
                    <form onSubmit={handleLogin} className={styles.form}>
                        <h2>Вход в аккаунт</h2>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                            className={styles.input}
                        />
                        <button type="submit" className={styles.submitButton}>
                            Войти
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className={styles.form}>
                        <h2>Регистрация</h2>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Имя"
                            value={registrationData.firstName}
                            onChange={handleRegistrationChange}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Фамилия"
                            value={registrationData.lastName}
                            onChange={handleRegistrationChange}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            name="middleName"
                            placeholder="Отчество"
                            value={registrationData.middleName}
                            onChange={handleRegistrationChange}
                            className={styles.input}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={registrationData.email}
                            onChange={handleRegistrationChange}
                            required
                            className={styles.input}
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Телефон"
                            value={registrationData.phone}
                            onChange={handleRegistrationChange}
                            className={styles.input}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            value={registrationData.password}
                            onChange={handleRegistrationChange}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Подтвердите пароль"
                            value={registrationData.confirmPassword}
                            onChange={handleRegistrationChange}
                            required
                            className={styles.input}
                        />
                        <select
                            name="role"
                            value={registrationData.role}
                            onChange={handleRegistrationChange}
                            className={styles.input}
                        >
                            <option value="user">Пользователь</option>
                            <option value="admin">Администратор</option>
                        </select>
                        <button type="submit" className={styles.submitButton}>
                            Зарегистрироваться
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}