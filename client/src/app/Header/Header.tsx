'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import AuthModal from '../components/AuthModal';
import styles from './header.module.css';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
    const { user, login, logout } = useAuth();  // Используем кастомный хук useAuth
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Обработка успешной авторизации
    const handleAuthSuccess = (userData: any) => {
        login(userData);
        setIsAuthModalOpen(false);  // Закрываем модальное окно
    };

    return (
        <div className={styles.head}>
            <div className={styles.logoContainer}>
                <Image src="/logo.png" alt="logo" width={70} height={70} />
                <div className={styles.calendarText}>
                    Календарь<br />соревнований
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <Link href="/" className={styles.text}>Главная</Link>
                <Link href="/news" className={styles.text}>Новости</Link>
                <Link href="/CompetitionCalendar" className={styles.text}>Соревнования</Link>
                <Link href="/user" className={styles.text}>Ближайшие соревнования</Link>
            </div>
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
                {/* Модальное окно для авторизации и регистрации */}
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    onAuthSuccess={handleAuthSuccess}
                />
            </div>
        </div>
    );
}