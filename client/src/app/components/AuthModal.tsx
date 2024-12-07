import React, { useState, useEffect } from 'react';
import styles from './AuthModal.module.css';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess: (userData: any) => void;
    initialTab?: 'login' | 'register';
}

export default function AuthModal({
                                      isOpen,
                                      onClose,
                                      onAuthSuccess,
                                      initialTab = 'login'
                                  }: AuthModalProps) {
    const { login } = useAuth();
    const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgotPassword' | 'resetPassword'>(initialTab);

    // State for form data
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [registrationData, setRegistrationData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });

    const [forgotPasswordData, setForgotPasswordData] = useState({
        email: ''
    });

    const [resetPasswordData, setResetPasswordData] = useState({
        code: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Error states
    const [loginErrors, setLoginErrors] = useState({
        email: false,
        password: false
    });

    const [registrationErrors, setRegistrationErrors] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPassword: false
    });

    const [forgotPasswordErrors, setForgotPasswordErrors] = useState({
        email: false
    });

    const [resetPasswordErrors, setResetPasswordErrors] = useState({
        code: false,
        newPassword: false,
        confirmPassword: false
    });

    // Reset effects
    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            resetAllErrors();
            resetAllForms();
        }
    }, [isOpen, initialTab]);

    // Reset functions
    const resetAllErrors = () => {
        setLoginErrors({ email: false, password: false });
        setRegistrationErrors({
            firstName: false,
            lastName: false,
            email: false,
            password: false,
            confirmPassword: false
        });
        setForgotPasswordErrors({ email: false });
        setResetPasswordErrors({
            code: false,
            newPassword: false,
            confirmPassword: false
        });
    };

    const resetAllForms = () => {
        setLoginData({ email: '', password: '' });
        setRegistrationData({
            firstName: '',
            lastName: '',
            middleName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            role: 'user'
        });
        setForgotPasswordData({ email: '' });
        setResetPasswordData({
            code: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    // Validation functions
    const validateLogin = () => {
        const errors = {
            email: !loginData.email.trim(),
            password: !loginData.password.trim()
        };
        setLoginErrors(errors);
        return !Object.values(errors).some(Boolean);
    };

    const validateRegistration = () => {
        const errors = {
            firstName: !registrationData.firstName.trim(),
            lastName: !registrationData.lastName.trim(),
            email: !registrationData.email.trim(),
            password: !registrationData.password.trim(),
            confirmPassword: !registrationData.confirmPassword.trim() ||
                registrationData.password !== registrationData.confirmPassword
        };
        setRegistrationErrors(errors);
        return !Object.values(errors).some(Boolean);
    };

    const validateForgotPassword = () => {
        const errors = {
            email: !forgotPasswordData.email.trim()
        };
        setForgotPasswordErrors(errors);
        return !Object.values(errors).some(Boolean);
    };

    const validateResetPassword = () => {
        const errors = {
            code: !resetPasswordData.code.trim(),
            newPassword: !resetPasswordData.newPassword.trim(),
            confirmPassword: !resetPasswordData.confirmPassword.trim() ||
                resetPasswordData.newPassword !== resetPasswordData.confirmPassword
        };
        setResetPasswordErrors(errors);
        return !Object.values(errors).some(Boolean);
    };

    // Change handlers
    const createChangeHandler = (
        setState: React.Dispatch<React.SetStateAction<any>>,
        setErrors: React.Dispatch<React.SetStateAction<any>>
    ) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prev: any) => ({
            ...prev,
            [name]: value
        }));

        // Reset specific error when user starts typing
        setErrors((prev: any) => ({ ...prev, [name]: false }));
    };

    // Submission handlers
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateLogin()) return;

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

        if (!validateRegistration()) return;

        try {
            const response = await fetch('/api/auth/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка регистрации');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            login(data.user);
            onAuthSuccess(data.user);
            onClose();
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForgotPassword()) return;

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(forgotPasswordData),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при отправке кода');
            }

            alert('Код отправлен на ваш email');
            setActiveTab('resetPassword');
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateResetPassword()) return;

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resetPasswordData),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при сбросе пароля');
            }

            alert('Пароль успешно сброшен');
            onClose();
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    };

    // Render input with error handling
    const renderInput = (
        name: string,
        value: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        type: string,
        placeholder: string,
        errorState: boolean,
        additionalProps?: React.InputHTMLAttributes<HTMLInputElement>
    ) => (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`${styles.input} 
                ${errorState ? styles.errorInput : ''} 
                ${errorState ? styles.fadeOutError : ''}`}
            required
            {...additionalProps}
        />
    );

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

                {activeTab === 'login' && (
                    <form onSubmit={handleLogin} className={styles.form}>
                        <h2>Вход в аккаунт</h2>
                        {renderInput(
                            'email',
                            loginData.email,
                            createChangeHandler(setLoginData, setLoginErrors),
                            'email',
                            'Email',
                            loginErrors.email
                        )}
                        {renderInput(
                            'password',
                            loginData.password,
                            createChangeHandler(setLoginData, setLoginErrors),
                            'password',
                            'Пароль',
                            loginErrors.password,
                            { autoComplete: 'current-password' }
                        )}
                        <button type="submit" className={styles.submitButton}>
                            Войти
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('forgotPassword')}
                            className={styles.forgotPasswordButton}
                        >
                            Забыли пароль?
                        </button>
                    </form>
                )}

                {activeTab === 'register' && (
                    <form onSubmit={handleRegister} className={styles.form}>
                        <h2>Регистрация</h2>
                        {renderInput(
                            'firstName',
                            registrationData.firstName,
                            createChangeHandler(setRegistrationData, setRegistrationErrors),
                            'text',
                            'Имя',
                            registrationErrors.firstName
                        )}
                        {renderInput(
                            'lastName',
                            registrationData.lastName,
                            createChangeHandler(setRegistrationData, setRegistrationErrors),
                            'text',
                            'Фамилия',
                            registrationErrors.lastName
                        )}
                        {renderInput(
                            'middleName',
                            registrationData.middleName,
                            createChangeHandler(setRegistrationData, setRegistrationErrors),
                            'text',
                            'Отчество',
                            false
                        )}
                        {renderInput(
                            'email',
                            registrationData.email,
                            createChangeHandler(setRegistrationData, setRegistrationErrors),
                            'email',
                            'Email',
                            registrationErrors.email
                        )}
                        {renderInput(
                            'phone',
                            registrationData.phone,
                            createChangeHandler(setRegistrationData, setRegistrationErrors),
                            'tel',
                            'Телефон',
                            false
                        )}
                        {renderInput(
                            'password',
                            registrationData.password,
                            createChangeHandler(setRegistrationData, setRegistrationErrors),
                            'password',
                            'Пароль',
                            registrationErrors.password,
                            { autoComplete: 'new-password' }
                        )}
                        {renderInput(
                            'confirmPassword',
                            registrationData.confirmPassword,
                            createChangeHandler(setRegistrationData, setRegistrationErrors),
                            'password',
                            'Подтвердите пароль',
                            registrationErrors.confirmPassword,
                            { autoComplete: 'new-password' }
                        )}
                        <button type="submit" className={styles.submitButton}>
                            Зарегистрироваться
                        </button>
                    </form>
                )}

                {activeTab === 'forgotPassword' && (
                    <form onSubmit={handleForgotPassword} className={styles.form}>
                        <h2>Восстановление пароля</h2>
                        {renderInput(
                            'email',
                            forgotPasswordData.email,
                            createChangeHandler(setForgotPasswordData, setForgotPasswordErrors),
                            'email',
                            'Email',
                            forgotPasswordErrors.email
                        )}
                        <button type="submit" className={styles.submitButton}>
                            Отправить код
                        </button>
                    </form>
                )}

                {activeTab === 'resetPassword' && (
                    <form onSubmit={handleResetPassword} className={styles.form}>
                        <h2>Сброс пароля</h2>
                        {renderInput(
                            'code',
                            resetPasswordData.code,
                            createChangeHandler(setResetPasswordData, setResetPasswordErrors),
                            'text',
                            'Код из письма',
                            resetPasswordErrors.code
                        )}
                        {renderInput(
                            'newPassword',
                            resetPasswordData.newPassword,
                            createChangeHandler(setResetPasswordData, setResetPasswordErrors),
                            'password',
                            'Новый пароль',
                            resetPasswordErrors.newPassword,
                            { autoComplete: 'new-password' }
                        )}
                        {renderInput(
                            'confirmPassword',
                            resetPasswordData.confirmPassword,
                            createChangeHandler(setResetPasswordData, setResetPasswordErrors),
                            'password',
                            'Подтвердите новый пароль',
                            resetPasswordErrors.confirmPassword,
                            { autoComplete: 'new-password' }
                        )}
                        <button type="submit" className={styles.submitButton}>
                            Сохранить новый пароль
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
