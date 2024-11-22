'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import AuthModal from '@/app/components/AuthModal';
import styles from './header.module.css';
import Link from "next/link";

export default function Header() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <div className={styles.head}>
            <div className={styles.logoContainer}>
                <Image src="/logo.png" alt="logo" width={70} height={70} />
                <div className={styles.calendarText}>
                    Календарь<br/>соревнований
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <span className={styles.text}>Главная</span>
                <span className={styles.text}>Новости</span>
                <Link href="/CompetitionCalendar" className={styles.text}>Соревнования</Link>
                <span className={styles.text}>Ближайшие соревнования</span>
            </div>
            <div className={styles.authButtons}>
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

                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                />
            </div>
        </div>
    );
}