'use client';
import styles from './header.module.css';
import Image from 'next/image';

export default function Header() {
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
                <span className={styles.text}>Соревнования</span>
                <span className={styles.text}>Ближайшие соревнования</span>
            </div>
            <div className={styles.authButtons}>
                <button className={styles.authButton}>Войти</button>
                <button className={styles.authButton}>Зарегистрироваться</button>
            </div>
        </div>
    );
}