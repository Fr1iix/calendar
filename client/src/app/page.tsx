 import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.heroSection}>
                <div className={styles.imageContainer}>
                    <Image src="/main.png" alt="Sports" layout='fill' objectFit='cover' />
                </div>
                <div className={styles.textContainer}>
                    <h1>Добро пожаловать на наш <br/>Спортивный Календарь</h1>
                    <p>
                        Платформа для отслеживания спортивных мероприятий<br/> по всем видам спорта.
                    </p>
                </div>
            </div>

            <section className={styles.features}>
                <div className={styles.card}>
                    <Image src="/filter-icon.png" alt="Filter Icon" width={80} height={80} />
                    <h2>Фильтрация мероприятий</h2>
                    <p>Используйте продвинутую фильтрацию по видам спорта, местоположению и другим параметрам.</p>
                </div>

                <div className={styles.card}>
                    <Image src="/notification-icon.png" alt="Notification Icon" width={80} height={80} />
                    <h2>Персональные Уведомления</h2>
                    <p>Получайте уведомления о новых и измененных мероприятиях, чтобы ничего не пропустить.</p>
                </div>

                <div className={styles.card}>
                    <Image src="/calendar-icon.png" alt="Calendar Icon" width={80} height={80} />
                    <h2>Удобный Календарь</h2>
                    <p>Все мероприятия в одном месте с возможностью просмотра на ближайшие недели или месяцы.</p>
                </div>
            </section>
        </main>
    );
}