import React, { useState } from 'react';
import styles from './AuthModal.module.css';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess: (userData: any) => void;
}

interface ValidationErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
    const { login } = useAuth();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [errors, setErrors] = useState<ValidationErrors>({});

    const [registrationData, setRegistrationData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        middleName: '',
        phone: '',
        role: 'user',
    });

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePassword = (password: string): boolean => password.length >= 6;

    const validateLoginForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        if (!loginData.email) {
            newErrors.email = 'Email обязателен';
            isValid = false;
        } else if (!validateEmail(loginData.email)) {
            newErrors.email = 'Неверный формат email';
            isValid = false;
        }

        if (!loginData.password) {
            newErrors.password = 'Пароль обязателен';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateRegistrationForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        if (!registrationData.email) {
            newErrors.email = 'Email обязателен';
            isValid = false;
        } else if (!validateEmail(registrationData.email)) {
            newErrors.email = 'Неверный формат email';
            isValid = false;
        }

        if (!registrationData.password) {
            newErrors.password = 'Пароль обязателен';
            isValid = false;
        } else if (!validatePassword(registrationData.password)) {
            newErrors.password = 'Пароль должен содержать минимум 6 символов';
            isValid = false;
        }

        if (registrationData.password !== registrationData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value,
        }));
        setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
    };

    const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRegistrationData(prev => ({
            ...prev,
            [name]: value,
        }));
        setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateLoginForm()) {
            return;
        }

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
                setErrors({
                    general: error.message === 'Incorrect email or password'
                        ? 'Неверный email или пароль'
                        : error.message,
                });
            }
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateRegistrationForm()) {
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
                setErrors({
                    general: error.message === 'Email already exists'
                        ? 'Пользователь с таким email уже существует'
                        : error.message,
                });
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
                        onClick={() => {
                            setActiveTab('login');
                            setErrors({});
                        }}
                    >
                        Вход
                    </button>
                    <button
                        className={activeTab === 'register' ? styles.activeTab : styles.tab}
                        onClick={() => {
                            setActiveTab('register');
                            setErrors({});
                        }}
                    >
                        Регистрация
                    </button>
                </div>

                {errors.general && <div className={styles.errorBanner}>{errors.general}</div>}

                {activeTab === 'login' ? (
                    <form onSubmit={handleLogin} className={styles.form}>
                        <h2>Вход в аккаунт</h2>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                            />
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="password"
                                name="password"
                                placeholder="Пароль"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                            />
                            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                        </div>
                        <button type="submit" className={styles.submitButton}>
                            Войти
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className={styles.form}>
                        <h2>Регистрация</h2>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Имя"
                                value={registrationData.firstName}
                                onChange={handleRegistrationChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Фамилия"
                                value={registrationData.lastName}
                                onChange={handleRegistrationChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="middleName"
                                placeholder="Отчество"
                                value={registrationData.middleName}
                                onChange={handleRegistrationChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={registrationData.email}
                                onChange={handleRegistrationChange}
                                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                            />
                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Телефон"
                                value={registrationData.phone}
                                onChange={handleRegistrationChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="password"
                                name="password"
                                placeholder="Пароль"
                                value={registrationData.password}
                                onChange={handleRegistrationChange}
                                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                            />
                            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Подтвердите пароль"
                                value={registrationData.confirmPassword}
                                onChange={handleRegistrationChange}
                                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                            />
                            {errors.confirmPassword && (
                                <span className={styles.errorText}>{errors.confirmPassword}</span>
                            )}
                        </div>
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
