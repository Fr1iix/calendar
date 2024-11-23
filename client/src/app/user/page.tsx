'use client'
import React, { useState } from 'react';
import styles from './UserProfile.module.css'; // Импортируем стили

const UserProfile = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        birthDate: '',
        gender: '',
        address: '',
        age: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Сохраненные данные:', userData);
        // Здесь можно добавить логику отправки данных на сервер
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Профиль пользователя</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={styles.formGroup}>
                        <label htmlFor="firstName" className={styles.label}>
                            Имя
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleInputChange}
                            className={`${styles.input} ${styles.formGroup}`}
                            placeholder="Введите имя"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="lastName" className={styles.label}>
                            Фамилия
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleInputChange}
                            className={`${styles.input} ${styles.formGroup}`}
                            placeholder="Введите фамилию"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="middleName" className={styles.label}>
                            Отчество
                        </label>
                        <input
                            type="text"
                            id="middleName"
                            name="middleName"
                            value={userData.middleName}
                            onChange={handleInputChange}
                            className={`${styles.input} ${styles.formGroup}`}
                            placeholder="Введите отчество"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="birthDate" className={styles.label}>
                            Дата рождения
                        </label>
                        <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            value={userData.birthDate}
                            onChange={handleInputChange}
                            className={`${styles.input} ${styles.formGroup}`}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="gender" className={styles.label}>
                            Пол
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={userData.gender}
                            onChange={handleInputChange}
                            className={`${styles.select} ${styles.formGroup}`}
                        >
                            <option value="">Выберите пол</option>
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                            <option value="other">Другой</option>
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
                            value={userData.age}
                            onChange={handleInputChange}
                            className={`${styles.input} ${styles.formGroup}`}
                            placeholder="Введите возраст"
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="address" className={styles.label}>
                        Адрес
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                        className={`${styles.input} ${styles.formGroup}`}
                        placeholder="Введите адрес"
                    />
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                >
                    Сохранить
                </button>
            </form>
        </div>
    );
};

export default UserProfile;
