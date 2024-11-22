// components/Footer.tsx
import React from 'react';
import Image from 'next/image';
import styles from './Footer.module.css'; // Импортируем стили для футера

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <Image src={"/logo.png"} alt="Логотип" width={50} height={50} />
                    <h2 className={styles.title}>Спортивный календарь</h2>
                </div>
                <div className={styles.centerText}>
                    <p>© 2024 Все права защищены.</p>
                </div>
                <div className={styles.contactInfo}>
                    <p>Контакты:</p>
                    <p>Министерство спорта России</p>
                    <p>105064, Москва, ул. Казакова, 18</p>
                    <p>+7 (495) 720-53-80</p>
                    <p>
                        <a href="mailto:info@minsport.gov.ru" className={styles.email}>info@minsport.gov.ru</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;