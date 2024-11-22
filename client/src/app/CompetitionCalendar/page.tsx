'use client';

import React, { useState } from 'react';
import styles from './CompetitionCalendar.module.css'
const competitionsData = [
  {
    date: '2024-07-15',
    sport: 'Баскетбол',
    discipline: 'Мужской турнир',
    program: 'Групповой этап',
    venue: 'Городской спортивный комплекс',
    participants: 12,
    genderAge: 'Мужчины',
    competitionType: 'Чемпионат'
  },
  {
    date: '2024-08-20',
    sport: 'Плавание',
    discipline: 'Вольный стиль',
    program: 'Региональный отбор',
    venue: 'Водный центр',
    participants: 25,
    genderAge: 'Женщины',
    competitionType: 'Межрегиональный'
  },
  {
    date: '2024-09-10',
    sport: 'Баскетбол',
    discipline: 'Женский турнир',
    program: 'Финал',
    venue: 'Спортивный дворец',
    participants: 8,
    genderAge: 'Женщины',
    competitionType: 'Кубок'
  },
  {
    date: '2024-07-22',
    sport: 'Плавание',
    discipline: 'Брасс',
    program: 'Районные соревнования',
    venue: 'Городской бассейн',
    participants: 15,
    genderAge: 'Юниоры',
    competitionType: 'Районный'
  }
];

export default function Page() {
  const [filters, setFilters] = useState({
    sport: '',
    discipline: '',
    program: '',
    venue: '',
    participants: '',
    genderAge: '',
    dateFrom: '',
    dateTo: '',
    competitionType: ''
  });

  const handleFilterChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredCompetitions = competitionsData.filter(competition => {
    return Object.entries(filters).every(([key, value]) => {
      // Пропускаем пустые фильтры
      if (!value) return true;

      switch(key) {
        case 'participants':
          return competition[key] >= Number(value);
        case 'dateFrom':
          return !value || competition.date >= value;
        case 'dateTo':
          return !value || competition.date <= value;
        default:
          return // competition[key].toLowerCase().includes(value.toLowerCase());
      }
    });
  });

  return (
      <div className={styles.filterSection}>
        <h2 className={styles.filterTitle}>Фильтры</h2>
        <div className={styles.filterGrid}>
          <div>
            <label className={styles.filterLabel}>Вид спорта</label>
            <select
                name="sport"
                value={filters.sport}
                onChange={handleFilterChange}
                className={styles.filterInput}
            >
              <option value="">Все виды спорта</option>
              <option>Баскетбол</option>
              <option>Плавание</option>
            </select>
          </div>

          <div>
            <label className={styles.filterLabel}>Дисциплина</label>
            <input
                type="text"
                name="discipline"
                value={filters.discipline}
                onChange={handleFilterChange}
                placeholder="Введите дисциплину"
                className={styles.filterInput}
            />
          </div>

          <div>
            <label className={styles.filterLabel}>Программа</label>
            <input
                type="text"
                name="program"
                value={filters.program}
                onChange={handleFilterChange}
                placeholder="Введите программу"
                className={styles.filterInput}
            />
          </div>

          <div>
            <label className={styles.filterLabel}>Место проведения</label>
            <input
                type="text"
                name="venue"
                value={filters.venue}
                onChange={handleFilterChange}
                placeholder="Введите место"
                className={styles.filterInput}
            />
          </div>

          <div>
            <label className={styles.filterLabel}>Минимальное число участников</label>
            <input
                type="number"
                name="participants"
                value={filters.participants}
                onChange={handleFilterChange}
                placeholder="Число участников"
                min="0"
                className={styles.filterInput}
            />
          </div>

          <div>
            <label className={styles.filterLabel}>Пол/Возраст</label>
            <select
                name="genderAge"
                value={filters.genderAge}
                onChange={handleFilterChange}
                className={styles.filterInput}
            >
              <option value="">Все</option>
              <option>Мужчины</option>
              <option>Женщины</option>
              <option>Юниоры</option>
            </select>
          </div>

          <div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Тип соревнования</label>
              <select
                  name="competitionType"
                  value={filters.competitionType}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Все типы</option>
                <option>Чемпионат</option>
                <option>Межрегиональный</option>
                <option>Районный</option>
                <option>Кубок</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Дата от</label>
              <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Дата до</label>
              <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
)
  ;
}

