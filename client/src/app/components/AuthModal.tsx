import React, { useState, useEffect } from 'react';
import styles from './AuthModal.module.css';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess: (userData: any) => void;
    initialTab?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = 'login' }: AuthModalProps) {
    const { login } = useAuth();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

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

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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

            localStorage.setItem('token', data.token);
            login(data.user);

            onAuthSuccess(data.user);
            onClose();
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

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
                    password: registrationData.password,
                    firstName: registrationData.firstName,
                    lastName: registrationData.lastName,
                    middleName: registrationData.middleName,
                    phone: registrationData.phone,
                    role: registrationData.role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка регистрации');
            }

            if (data.token) {
                const userData = { token: data.token, email: registrationData.email, ...data.user };
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(userData));
                login(userData);

                onAuthSuccess(userData);
                onClose();
            } else {
                throw new Error('Токен не получен в ответе');
            }
        } catch (error) {
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