import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.heroSection}>
                <div className={styles.imageContainer}>
                    <Image src="/main.png" alt="Sports" width={800} height={600} layout="responsive" />
                </div>
                <div className={styles.textContainer}>
                    <h1>Добро пожаловать на наш<br />Спортивный Календарь</h1>
                    <p>
                        Платформа для отслеживания спортивных мероприятий<br /> по всем видам спорта.
                    </p>
                    <Link href="/CompetitionCalendar">
                        <button className={styles.eventButton}>Список соревнований</button>
                    </Link>
                </div>
            </div>

            <div className={styles.separator}>
                <div className={styles.itemsWrap}>
                    <div className={`${styles.items} ${styles.marquee}`}>
                        {[...Array(10)].map((_, index) => (
                            <div key={index} className={styles.item}>
                                Победа Соревнования Календарь
                            </div>
                        ))}
                    </div>
                    <div aria-hidden="true" className={`${styles.items} ${styles.marquee}`}>
                        {[...Array(10)].map((_, index) => (
                            <div key={index} className={styles.item}>
                                Победа Соревнования Календарь
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <section className={styles.features}>
                <div className={styles.card}>
                    <Image src="/filter.png" alt="Filter Icon" width={80} height={80} layout="fixed" />
                    <h2>Фильтрация мероприятий</h2>
                    <p>Используйте продвинутую фильтрацию по видам спорта, местоположению и другим параметрам.</p>
                </div>

                <div className={styles.card}>
                    <Image src="/notification.png" alt="Notification Icon" width={80} height={80} layout="fixed" />
                    <h2>Персональные Уведомления</h2>
                    <p>Получайте уведомления о новых и измененных мероприятиях, чтобы ничего не пропустить.</p>
                </div>

                <div className={styles.card}>
                    <Image src="/calendar.png" alt="Calendar Icon" width={80} height={80} layout="fixed" />
                    <h2>Удобный Календарь</h2>
                    <p>Все мероприятия в одном месте с возможностью просмотра на ближайшие недели или месяцы.</p>
                </div>
            </section>
        </main>
    );
}