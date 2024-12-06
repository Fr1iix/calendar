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
    const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register'>('login');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleAuthSuccess = (userData: any) => {
        login(userData);
        setIsAuthModalOpen(false);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
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
                    <Link href="/zayav_sorev" className={styles.text}>Заявка на соревнование</Link>
                </nav>

                <div className={styles.authButtons}>
                    {user ? (
                        <>
                            <Link href="/user" className={styles.userName}>
                                {user.email}
                            </Link>
                            {user.role === 'admin' && (
                                <Link href="/admin" className={styles.authButton}>
                                    Админ-панель
                                </Link>
                            )}
                            <button onClick={logout} className={styles.authButton}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={styles.authButton}
                                onClick={() => { setAuthModalInitialTab('login'); setIsAuthModalOpen(true); }}
                            >
                                Войти
                            </button>
                            <button
                                className={styles.authButton}
                                onClick={() => { setAuthModalInitialTab('register'); setIsAuthModalOpen(true); }}
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
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onAuthSuccess={handleAuthSuccess}
                initialTab={authModalInitialTab}
            />

            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
                <nav className={styles.mobileNav}>
                    <Link href="/" className={styles.mobileLink} onClick={handleLinkClick}>Главная</Link>
                    <Link href="/news" className={styles.mobileLink} onClick={handleLinkClick}>Новости</Link>
                    <Link href="/CompetitionCalendar" className={styles.mobileLink} onClick={handleLinkClick}>Соревнования</Link>
                    <Link href="/zayav_sorev" className={styles.text}>Заявка на соревнование</Link>

                    {user ? (
                        <>
                            <span className={styles.mobileUserEmail}>{user.email}</span>
                            {user.role === 'admin' && (
                                <Link href="/admin" className={styles.mobileAuthButton} onClick={handleLinkClick}>
                                    Админ-панель
                                </Link>
                            )}
                            <button onClick={() => { logout(); handleLinkClick(); }} className={styles.mobileAuthButton}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => { setIsAuthModalOpen(true); handleLinkClick(); }} className={styles.mobileAuthButton}>
                                Войти
                            </button>
                            <button onClick={() => { setIsAuthModalOpen(true); handleLinkClick(); }} className={styles.mobileAuthButton}>
                                Зарегистрироваться
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </>
    );
}