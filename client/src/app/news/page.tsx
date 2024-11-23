'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

type NewsItem = {
    id: number;
    date: string;
    title: string;
    image: string;
};

// Новости по умолчанию
const initialNews: NewsItem[] = [
    {
        id: 1,
        date: '22 ноября 2024',
        title: 'Ми м Федерации бобслея России Анатолием Пеговым',
        image: '/calendar.png'
    },
    {
        id: 2,
        date: '22 ноября 2024',
        title: 'Михаил Дегтярев обсудил строительство спортивных объектов в Коми с врио главы Республики Ростиславом Гольдштейном',
        image: '/calendar.png'
    },
    {
        id: 3,
        date: '21 ноября 2024',
        title: 'Михаил Дегтярев посетил спортивные объекты в Лужниках',
        image: '/main.png'
    },
    {
        id: 4,
        date: '21 ноября 2024',
        title: 'Михаил Дегтярев посетил спортивные объекты в Лужниках',
        image: '/main.png'
    }
];

const NewsPage = () => {
    const [news, setNews] = useState<NewsItem[]>(initialNews);

    // Получение новостей из localStorage (если нужно сохранить между сессиями)
    useEffect(() => {
        const storedNews = JSON.parse(localStorage.getItem('news') || '[]');
        if (storedNews.length > 0) {
            setNews(storedNews);
        }
    }, []);

    return (
        <div className={styles.newsContainer}>
            <h1>Новости</h1>
            <div className={styles.newsList}>
                {news.length > 0 ? (
                    news.map(item => (
                        <div className={styles.newsItem} key={item.id}>
                            <div className={styles.imageWrapper}>
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className={styles.textWrapper}>
                                <h3>{item.title}</h3>
                                <p>{item.date}</p> {/* Отображение даты новости */}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Нет новостей для отображения</p>
                )}
            </div>
        </div>
    );
};

export default NewsPage;
