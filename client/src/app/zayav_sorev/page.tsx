'use client'
import React, { useState } from 'react';
import styles from './ZayavSorev.module.css';

const ZayavSorev = () => {
    const [formData, setFormData] = useState({
        dateStart: '',
        dateEnd: '',
        name: '',
        gender: '',
        age: '',
        place: '',
        quantity: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Данные заявки:', formData);
        // Здесь можно добавить логику отправки данных на сервер
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Заявка на соревнование</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.dateContainer}>
                    <div className={styles.formGroup}>
                        <label htmlFor="dateStart" className={styles.label}>
                            Дата начала
                        </label>
                        <input
                            type="date"
                            id="dateStart"
                            name="dateStart"
                            value={formData.dateStart}
                            onChange={handleInputChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="dateEnd" className={styles.label}>
                            Дата окончания
                        </label>
                        <input
                            type="date"
                            id="dateEnd"
                            name="dateEnd"
                            value={formData.dateEnd}
                            onChange={handleInputChange}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                        Название
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Введите название соревнования"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="gender" className={styles.label}>
                        Пол
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={styles.select}
                    >
                        <option value="">Выберите пол</option>
                        <option value="male">Мужской</option>
                        <option value="female">Женский</option>
                        <option value="mixed">Смешанный</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="age" className={styles.label}>
                        Возраст
                    </label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Введите возраст"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="place" className={styles.label}>
                        Место
                    </label>
                    <input
                        type="text"
                        id="place"
                        name="place"
                        value={formData.place}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Введите место проведения"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="quantity" className={styles.label}>
                        Количество
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="Введите количество участников"
                    />
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                >
                    Подать заявку
                </button>
            </form>
        </div>
    );
};

export default ZayavSorev;