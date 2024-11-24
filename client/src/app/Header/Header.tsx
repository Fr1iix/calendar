'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import AuthModal from '../components/AuthModal';
import styles from './header.module.css';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
    const { user, login, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

    const handleAuthSuccess = (userData: any) => {
        login(userData);
        setIsAuthModalOpen(false);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    // Новая функция для закрытия модального окна
    const handleCloseModal = () => {
        setIsAuthModalOpen(false);
        // Сбрасываем значение вкладки при закрытии
        setAuthModalTab('login');
    };

    // Новая функция для открытия модального окна
    const handleOpenModal = (tab: 'login' | 'register') => {
        setAuthModalTab(tab);
        setIsAuthModalOpen(true);
    };

    return (
        <>
            <header className={styles.head}>
                <div className={styles.logoContainer}>
                    <Image src="/logo.png" alt="logo" width={70} height={70} />
                    <div className={styles.calendarText}>
                        Календарь<br />соревнований
                    </div>
                </div>
                <nav className={styles.buttonContainer}>
                    <Link href="/" className={styles.text}>Главная</Link>
                    <Link href="/news" className={styles.text}>Новости</Link>
                    <Link href="/CompetitionCalendar" className={styles.text}>Соревнования</Link>
                    <Link href="/user" className={styles.text}>Ближайшие соревнования</Link>
                </nav>
                <div className={styles.authButtons}>
                    {user ? (
                        <>
                            <Link href="/user" className={styles.userName}>
                                {user.email}
                            </Link>
                            <button onClick={logout} className={styles.authButton}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={styles.authButton}
                                onClick={() => handleOpenModal('login')}
                            >
                                Войти
                            </button>
                            <button
                                className={styles.authButton}
                                onClick={() => handleOpenModal('register')}
                            >
                                Зарегистрироваться
                            </button>
                        </>
                    )}
                    <button
                        className={styles.burger}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Меню навигации"
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={handleCloseModal}
                    onAuthSuccess={handleAuthSuccess}
                    initialTab={authModalTab}
                />
            </header>

            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
                <nav className={styles.mobileNav}>
                    <Link href="/" className={styles.mobileLink} onClick={handleLinkClick}>Главная</Link>
                    <Link href="/news" className={styles.mobileLink} onClick={handleLinkClick}>Новости</Link>
                    <Link href="/CompetitionCalendar" className={styles.mobileLink} onClick={handleLinkClick}>Соревнования</Link>
                    <Link href="/" className={styles.mobileLink} onClick={handleLinkClick}>Ближайшие соревнования</Link>
                    {user ? (
                        <>
                            <span className={styles.mobileUserEmail}>{user.email}</span>
                            <button onClick={() => { logout(); handleLinkClick(); }} className={styles.mobileAuthButton}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={styles.mobileAuthButton}
                                onClick={() => {
                                    handleOpenModal('login');
                                    handleLinkClick();
                                }}
                            >
                                Войти
                            </button>
                            <button
                                className={styles.mobileAuthButton}
                                onClick={() => {
                                    handleOpenModal('register');
                                    handleLinkClick();
                                }}
                            >
                                Зарегистрироваться
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </>
    );
}