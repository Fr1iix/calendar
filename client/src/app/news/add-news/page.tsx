'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Для редиректа

type NewsItem = {
    id: number;
    date: string;
    title: string;
    image: string;
};

const AddNewsPage = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newImage, setNewImage] = useState('');
    const router = useRouter(); // Хук для редиректа

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role !== 'admin') {
            // Если роль не admin, перенаправляем на главную
            router.push('/');
        }

        // Загрузка новостей из localStorage
        const storedNews = localStorage.getItem('news');
        if (storedNews) {
            setNews(JSON.parse(storedNews));
        }
    }, [router]); // Хук с зависимостью на router, чтобы редирект произошел при монтировании

    const handleAddNews = () => {
        const newNewsItem: NewsItem = {
            id: news.length + 1,
            date: newDate,
            title: newTitle,
            image: newImage
        };

        const updatedNews = [...news, newNewsItem];
        setNews(updatedNews);
        localStorage.setItem('news', JSON.stringify(updatedNews));

        setNewTitle('');
        setNewDate('');
        setNewImage('');
    };

    return (
        <div className={styles.addNewsContainer}>
            <h1>Добавить новость</h1>
            <Link href="/news" className={styles.viewNewsLink}>Перейти к новостям</Link>
            <div className={styles.formContainer}>
                <input
                    type="text"
                    placeholder="Заголовок новости"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="Дата новости"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="Ссылка на изображение"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className={styles.input}
                />
                <button onClick={handleAddNews} className={styles.submitButton}>
                    Добавить новость
                </button>
            </div>
        </div>
    );
};

export default AddNewsPage;