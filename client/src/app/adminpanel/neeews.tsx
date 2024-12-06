'use client';
import { useState, useEffect } from 'react';
import styles from './neeews.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Для редиректа

type NewsItem = {
    id: number;
    date: string;
    title: string;
    image: string;
};

const AddNewsPage = () => {
    const [news, setNews] = useState<NewsItem[]>([]); // Для хранения новостей
    const [newTitle, setNewTitle] = useState(''); // Для ввода заголовка новости
    const [newDate, setNewDate] = useState(''); // Для ввода даты новости
    const [newImage, setNewImage] = useState(''); // Для ввода ссылки на изображение
    const [error, setError] = useState<boolean>(false); // Стейт для ошибки
    const router = useRouter(); // Хук для редиректа

    // Проверяем роль пользователя и загружаем новости из localStorage
    useEffect(() => {

        // Загрузка новостей из localStorage
        const storedNews = localStorage.getItem('news');
        if (storedNews) {
            setNews(JSON.parse(storedNews));
        }
    }, [router]); // Хук с зависимостью на router, чтобы редирект произошел при монтировании

    // Функция для добавления новости
    const handleAddNews = () => {
        // Проверка на пустые поля
        if (!newTitle || !newDate || !newImage) {
            setError(true); // Устанавливаем ошибку, если какое-то поле пустое
            return; // Если поля не заполнены, не добавляем новость
        }

        setError(false); // Очистка ошибки, если все поля заполнены

        const newNewsItem: NewsItem = {
            id: news.length + 1,
            date: newDate,
            title: newTitle,
            image: newImage
        };

        const updatedNews = [...news, newNewsItem]; // Добавляем новую новость
        setNews(updatedNews);
        localStorage.setItem('news', JSON.stringify(updatedNews)); // Сохраняем новости в localStorage

        setNewTitle(''); // Очищаем поле заголовка
        setNewDate(''); // Очищаем поле даты
        setNewImage(''); // Очищаем поле изображения
    };

    // Хук для автоматического удаления ошибки через 3 секунды
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(false);
            }, 3000); // Ошибка исчезает через 3 секунды
            return () => clearTimeout(timer); // Очищаем таймер при размонтировании
        }
    }, [error]);

    return (
        <div className={styles.addNewsContainer}>
            <h1>Добавить новость</h1>
            <Link href="/news" className={styles.viewNewsLink}>
                Перейти к новостям
            </Link>
            <div className={styles.formContainer}>
                <input
                    type="text"
                    placeholder="Заголовок новости"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className={`${styles.input} ${error && !newTitle ? styles.errorInput : ''}`} // Красная рамка, если ошибка
                />
                <input
                    type="text"
                    placeholder="Дата новости"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className={`${styles.input} ${error && !newDate ? styles.errorInput : ''}`} // Красная рамка, если ошибка
                />
                <input
                    type="text"
                    placeholder="Ссылка на изображение"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className={`${styles.input} ${error && !newImage ? styles.errorInput : ''}`} // Красная рамка, если ошибка
                />
                <button onClick={handleAddNews} className={styles.submitButton}>
                    Добавить новость
                </button>
            </div>
        </div>
    );
};

export default AddNewsPage;
