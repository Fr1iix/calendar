'use client';
import React, { useState } from 'react';
import styles from './zayav.module.css';

const ZayavSorev = () => {
    const [formData, setFormData] = useState({
        dateStart: '',
        dateEnd: '',
        name: '',
        gender: {
            male: false,
            female: false,
        },
        age: '',
        place: '',
        quantity: '',
    });

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Добавить соревнование</h2>

            <form className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                        Название
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        className={styles.input}
                        placeholder="Введите название соревнования"
                        required
                    />
                </div>

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
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    dateStart: e.target.value,
                                })
                            }
                            className={styles.input}
                            required
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
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    dateEnd: e.target.value,
                                })
                            }
                            className={styles.input}
                            required
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Пол</label>
                    <div className={styles.checkboxContainer}>
                        <div className={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                id="male"
                                name="male"
                                checked={formData.gender.male}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        gender: {
                                            ...formData.gender,
                                            male: e.target.checked,
                                        },
                                    })
                                }
                                className={styles.checkbox}
                            />
                            <label htmlFor="male">Мужской</label>
                        </div>
                        <div className={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                id="female"
                                name="female"
                                checked={formData.gender.female}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        gender: {
                                            ...formData.gender,
                                            female: e.target.checked,
                                        },
                                    })
                                }
                                className={styles.checkbox}
                            />
                            <label htmlFor="female">Женский</label>
                        </div>
                    </div>
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
                        onChange={(e) =>
                            setFormData({ ...formData, age: e.target.value })
                        }
                        className={styles.input}
                        placeholder="Введите возраст"
                        min="0"
                        required
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
                        onChange={(e) =>
                            setFormData({ ...formData, place: e.target.value })
                        }
                        className={styles.input}
                        placeholder="Введите страну, город, улицу"
                        required
                    />
                    <small className={styles.tooltip}>
                        Пример: Россия, Москва, Тверская улица
                    </small>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="quantity" className={styles.label}>
                        Количество участников
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                quantity: e.target.value,
                            })
                        }
                        className={styles.input}
                        placeholder="Введите количество участников"
                        min="1"
                        required
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    Подать заявку
                </button>
            </form>
        </div>
    );
};

export default ZayavSorev;
