'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import AuthModal from '../components/AuthModal';
import styles from './header.module.css';
import Link from "next/link";

export default function Header() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [userName, setUserName] = useState<string | null>(null); // State to store the user's name

    // Function to handle successful authentication (login or register)
    const handleAuthSuccess = (name: string) => {
        setUserName(name);
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
                {userName ? (
                    <Link href="/user" className={styles.userName}>
                        {userName} {/* Make the username a clickable link */}
                    </Link>
                ) : (
                    <>
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
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    onAuthSuccess={handleAuthSuccess} // Pass the callback function
                />
            </div>
        </div>
    );
}
