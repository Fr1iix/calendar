'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import AuthModal from '../components/AuthModal';
import styles from './header.module.css';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { FaBars, FaTimes } from 'react-icons/fa'; // Используем иконки из react-icons

export default function Header() {
    const { user, login, logout } = useAuth();  // Используем кастомный хук useAuth
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние для меню

    // Обработка успешной авторизации
    const handleAuthSuccess = (userData: any) => {
        login(userData);
        setIsAuthModalOpen(false);  // Закрываем модальное окно
    };

    // Закрыть меню при клике на ссылку
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
                    <Link href="/user" className={styles.text}>Ближайшие соревнования</Link>
                </nav>
                <div className={styles.authButtons}>
                    {user ? (
                        <> {/* Отображаем email и кнопку "Выйти" */}
                            <Link href="/user" className={styles.userName}>
                                {user.email} {/* Отображаем email пользователя */}
                            </Link>
                            <button onClick={logout} className={styles.authButton}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <> {/* Кнопки для авторизации и регистрации */}
                            <button
                                className={styles.authButton}
                                onClick={() => setIsAuthModalOpen(true)}
                            >
                                Войти
                            </button>
                            <button
                                className={styles.authButton}
                                onClick={() => setIsAuthModalOpen(true)}
                            >
                                Зарегистрироваться
                            </button>
                        </>
                    )}
                    {/* Кнопка-бургер */}
                    <button
                        className={styles.burger}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Меню навигации"
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
                {/* Модальное окно для авторизации и регистрации */}
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    onAuthSuccess={handleAuthSuccess}
                />
            </header>

            {/* Выдвижное меню */}
            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
                <nav className={styles.mobileNav}>
                    <Link href="/" className={styles.mobileLink} onClick={handleLinkClick}>Главная</Link>
                    <Link href="/news" className={styles.mobileLink} onClick={handleLinkClick}>Новости</Link>
                    <Link href="/CompetitionCalendar" className={styles.mobileLink} onClick={handleLinkClick}>Соревнования</Link>
                    <Link href="/user" className={styles.mobileLink} onClick={handleLinkClick}>Ближайшие соревнования</Link>
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
                                onClick={() => { setIsAuthModalOpen(true); handleLinkClick(); }}
                            >
                                Войти
                            </button>
                            <button
                                className={styles.mobileAuthButton}
                                onClick={() => { setIsAuthModalOpen(true); handleLinkClick(); }}
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