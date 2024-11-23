'use client';
import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

type NewsItem = {
    id: number;
    date: string;
    title: string;
    image: string;
};

// Функция для сохранения новостей в localStorage
const saveNewsToLocalStorage = (news: NewsItem[]) => {
    localStorage.setItem('news', JSON.stringify(news));
};

const AddNewsPage = () => {
    const [news, setNews] = useState<NewsItem[]>(JSON.parse(localStorage.getItem('news') || '[]'));
    const [newTitle, setNewTitle] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newImage, setNewImage] = useState('');
    <Link href="/news" className={styles.viewNewsLink}>Перейти к новостям</Link>

    const handleAddNews = () => {
        const newNewsItem: NewsItem = {
            id: news.length + 1,
            date: newDate,
            title: newTitle,
            image: newImage
        };

        const updatedNews = [...news, newNewsItem];
        setNews(updatedNews);
        saveNewsToLocalStorage(updatedNews);

        setNewTitle('');
        setNewDate('');
        setNewImage('');
    };

    return (
        <div className={styles.addNewsContainer}>
            <h1>Добавить новость</h1>
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
