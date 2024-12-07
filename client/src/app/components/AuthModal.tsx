import React, { useState, useEffect, FormEvent } from 'react';
import styles from './AuthModal.module.css';
import { useAuth } from '../hooks/useAuth';

// Comprehensive type definitions
interface LoginData {
    email: string;
    password: string;
}

interface RegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: 'male' | 'female' | '';
    age: string;
    city: string;
    region: string;
    country: string;
    password: string;
    confirmPassword: string;
}

interface ForgotPasswordData {
    email: string;
}

interface ResetPasswordData {
    code: string;
    newPassword: string;
    confirmPassword: string;
}

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess: (userData: any) => void;
    initialTab?: 'login' | 'register' | 'forgotPassword' | 'resetPassword';
}

export default function AuthModal({
                                      isOpen,
                                      onClose,
                                      onAuthSuccess,
                                      initialTab = 'login',
                                  }: AuthModalProps) {
    const { login } = useAuth();
    const [activeTab, setActiveTab] = useState<AuthModalProps['initialTab']>(initialTab);
    const [step, setStep] = useState(1);

    // Initial state objects
    const INITIAL_LOGIN_STATE: LoginData = {
        email: '',
        password: ''
    };

    const INITIAL_REGISTRATION_STATE: RegistrationData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        age: '',
        city: '',
        region: '',
        country: '',
        password: '',
        confirmPassword: '',
    };

    const INITIAL_FORGOT_PASSWORD_STATE: ForgotPasswordData = {
        email: ''
    };

    const INITIAL_RESET_PASSWORD_STATE: ResetPasswordData = {
        code: '',
        newPassword: '',
        confirmPassword: ''
    };

    // State management
    const [loginData, setLoginData] = useState<LoginData>(INITIAL_LOGIN_STATE);
    const [registrationData, setRegistrationData] = useState<RegistrationData>(INITIAL_REGISTRATION_STATE);
    const [forgotPasswordData, setForgotPasswordData] = useState<ForgotPasswordData>(INITIAL_FORGOT_PASSWORD_STATE);
    const [resetPasswordData, setResetPasswordData] = useState<ResetPasswordData>(INITIAL_RESET_PASSWORD_STATE);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            setStep(1);
            // Reset all form data
            setLoginData(INITIAL_LOGIN_STATE);
            setRegistrationData(INITIAL_REGISTRATION_STATE);
            setForgotPasswordData(INITIAL_FORGOT_PASSWORD_STATE);
            setResetPasswordData(INITIAL_RESET_PASSWORD_STATE);
        }
    }, [isOpen, initialTab]);

    // Generic input change handler with type-safe implementation
    const handleInputChange = <T extends object>(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        setState: React.Dispatch<React.SetStateAction<T>>
    ) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value }));
    };

    // Authentication handlers
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Ошибка входа');

            localStorage.setItem('token', data.token);
            login(data.user);
            onAuthSuccess(data.user);
            onClose();
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : 'Произошла ошибка');
        }
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();

        // Password validation
        if (registrationData.password !== registrationData.confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        try {
            const response = await fetch('/api/auth/registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Ошибка регистрации');

            const userData = {
                token: data.token,
                email: registrationData.email,
                ...data.user
            };

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(userData));

            login(userData);
            onAuthSuccess(userData);
            onClose();
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : 'Произошла ошибка');
        }
    };

    const handleForgotPassword = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(forgotPasswordData),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Ошибка при отправке кода');

            alert('Код отправлен на ваш email');
            setActiveTab('resetPassword');
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : 'Произошла ошибка');
        }
    };

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();

        // Password validation
        if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resetPasswordData),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Ошибка при сбросе пароля');

            alert('Пароль успешно сброшен');
            onClose();
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : 'Произошла ошибка');
        }
    };

    // Navigation handlers
    const handleNextRegistrationStep = (e: FormEvent) => {
        e.preventDefault();
        // Add validation for first step if needed
        setStep(2);
    };

    const handlePreviousRegistrationStep = () => {
        setStep(1);
    };

    // Render nothing if modal is closed
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {/* Close Button */}
                <button className={styles.closeButton} onClick={onClose}>×</button>

                {/* Tab Navigation */}
                <div className={styles.tabContainer}>
                    <button
                        className={activeTab === 'login' ? styles.activeTab : styles.tab}
                        onClick={() => setActiveTab('login')}
                    >
                        Вход
                    </button>
                    <button
                        className={activeTab === 'register' ? styles.activeTab : styles.tab}
                        onClick={() => { setActiveTab('register'); setStep(1); }}
                    >
                        Регистрация
                    </button>
                </div>

                {/* Login Form */}
                {activeTab === 'login' && (
                    <form onSubmit={handleLogin} className={styles.form}>
                        <h2>Вход в аккаунт</h2>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={loginData.email}
                            onChange={(e) => handleInputChange(e, setLoginData)}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Пароль"
                            value={loginData.password}
                            onChange={(e) => handleInputChange(e, setLoginData)}
                            required
                            className={styles.input}
                        />
                        <button type="submit" className={styles.submitButton}>Войти</button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('forgotPassword')}
                            className={styles.forgotPasswordButton}
                        >
                            Забыли пароль?
                        </button>
                    </form>
                )}

                {/* Registration Forms with Animation */}
                {activeTab === 'register' && (
                    <div className={styles.registrationFormsContainer}>
                        {/* Registration Step 1 */}
                        <div
                            className={`${styles.registrationStep} ${step === 1 ? styles.active : styles.prev}`}
                        >
                            <form onSubmit={handleNextRegistrationStep} className={styles.form}>
                                <h2>Регистрация - Шаг 1</h2>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Имя"
                                    value={registrationData.firstName}
                                    onChange={(e) => handleInputChange(e, setRegistrationData)}
                                    required
                                    className={styles.input}
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Фамилия"
                                    value={registrationData.lastName}
                                    onChange={(e) => handleInputChange(e, setRegistrationData)}
                                    required
                                    className={styles.input}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={registrationData.email}
                                    onChange={(e) => handleInputChange(e, setRegistrationData)}
                                    required
                                    className={styles.input}
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Телефон"
                                    value={registrationData.phone}
                                    onChange={(e) => handleInputChange(e, setRegistrationData)}
                                    required
                                    className={styles.input}
                                />
                                <select
                                    name="gender"
                                    value={registrationData.gender}
                                    onChange={(e) => handleInputChange(e, setRegistrationData)}
                                    className={styles.input}
                                    required
                                >
                                    <option value="" disabled>Пол</option>
                                    <option value="male">Мужской</option>
                                    <option value="female">Женский</option>
                                </select>
                                <button type="submit" className={styles.submitButton}>Далее</button>
                            </form>
                        </div>

                        {/* Registration Step 2 */}
                        <div
                            className={`${styles.registrationStep} ${step === 2 ? styles.active : ''}`}
                        >
                            <form onSubmit={handleRegister} className={styles.form}>
                                <h2>Регистрация - Шаг 2</h2>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Город"
                                    value={registrationData.city}
                                    onChange={(e) => handleInputChange(e, setRegistrationData)}
                                    required
                                    className={styles.input}
                                />
                                <input
                                    type="text"
                                    name="region"
                                    placeholder="Регион"
                                    value={registrationData.region}
                                    onChange={(e) => handleInputChange(e, setRegistrationData)}
                                    required
                                    className={styles.input}
                                />
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="Страна"
                                    value={registrationData.country}
                                    onChange={(e) => handleInputChange(e, setRegistrationData)}
                                    required
                                    className={styles.input}
                                />
                                <input
                                    type="number"
                                    name="age"
                                    placeholder="Возраст"
                                    value={registrationData.age}
                                    onChange={(e) => handleInputChange(e, setRegistrationData)}
                                    required
                                    className={styles.input}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Пароль"
                                    value={registrationData.password}
                                    onChange={(e) => handleInputChange(e, setRegistrationData)}
                                    required
                                    className={styles.input}
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Подтвердите пароль"
                                    value={registrationData.confirmPassword}
                                    onChange={(e) => handleInputChange(e, setRegistrationData)}
                                    required
                                    className={styles.input}
                                />
                                <div className={styles.buttons}>
                                    <button
                                        type="button"
                                        onClick={handlePreviousRegistrationStep}
                                        className={styles.submitButton}
                                    >
                                        Назад
                                    </button>
                                    <button type="submit" className={styles.submitButton11}>Зарегистрироваться</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
