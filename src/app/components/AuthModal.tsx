
'use client';
import React, { useState } from 'react';
import styles from './AuthModal.module.css';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Вход:', email, password);
        onClose();
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Регистрация:', name, email, password);
        onClose();
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
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            placeholder="Имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={styles.input}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.input}
                        />
                        <button type="submit" className={styles.submitButton}>
                            Зарегистрироваться
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
