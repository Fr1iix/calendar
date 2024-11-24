'use client';

import React, { useState } from 'react';
import styles from './CompetitionCalendar.module.css';
import YandexMap from './YandexMap';

interface Competition {
  eventNumber: number;
  date: string;
  sport: string;
  discipline: string;
  program: string;
  venue: string;
  participants: number;
  genderAge: string;
  competitionType: string;
  city: string;
  latitude: number;
  longitude: number;
  startDay: string;
  endDay: string;
  weekDays: string;
  categories: string[];
  organizer: string;
}

const competitionsData: Competition[] = [
  {
    eventNumber: 123456789012345,
    date: '2024-07-15',
    startDay: '01',
    endDay: '03',
    weekDays: 'Пт Вс',
    sport: 'Балтийский Кубок',
    discipline: 'Мужской турнир',
    program: 'Групповой этап',
    venue: 'Городской спортивный комплекс',
    participants: 12,
    genderAge: 'Мужчины',
    competitionType: 'Чемпионат',
    city: 'С.-Петербург',
    latitude: 55.751574,
    longitude: 37.573856,
    categories: ['гендер', 'возраст'],
    organizer: 'Рег. федерация',
  },
  {
    eventNumber: 2,
    date: '2024-08-20',
    startDay: '05',
    endDay: '07',
    weekDays: 'Пн Ср',
    sport: 'Кубок России',
    discipline: 'Вольный стиль',
    program: 'Региональный отбор',
    venue: 'Водный центр',
    participants: 25,
    genderAge: 'Женщины',
    competitionType: 'Межрегиональный',
    city: 'Москва',
    latitude: 59.93428,
    longitude: 30.335099,
    categories: ['гендер', 'возраст'],
    organizer: 'Фед. России',
  },
];

const Page = () => {
  const [filters, setFilters] = useState({
    sport: '',
    discipline: '',
    program: '',
    venue: '',
    participants: '',
    genderAge: '',
    dateFrom: '',
    dateTo: '',
    competitionType: '',
  });

  const [isMapVisible, setIsMapVisible] = useState(false);

  const toggleMapVisibility = () => {
    setIsMapVisible((prev) => !prev);
  };

  const handleFilterChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredCompetitions = competitionsData.filter((competition) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      if (key in competition) {
        switch (key) {
          case 'participants':
            return competition.participants >= (value ? Number(value) : 0);
          case 'dateFrom':
            return !value || competition.date >= value;
          case 'dateTo':
            return !value || competition.date <= value;
          default:
            const competitionValue = competition[key as keyof Competition];
            if (typeof competitionValue === 'string') {
              return competitionValue.toLowerCase().includes(value.toLowerCase());
            }
            return false;
        }
      }
      return false;
    });
  });

  return (
      <div className={styles.pageWrapper}>
        <div className={styles.contentContainer}>
          <div className={styles.filterSection}>
            <h2 className={styles.filterTitle}>Фильтры</h2>
            <div className={styles.filterGrid}>
              {/* Первый ряд */}
              <div className={styles.filterItem}>
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

              <div className={styles.filterItem}>
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

              <div className={styles.filterItem}>
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

              <div className={styles.filterItem}>
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

              <div className={styles.filterItem}>
                <label className={styles.filterLabel}>
                  Минимальное число участников
                </label>
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

              {/* Второй ряд */}
              <div className={styles.filterItem}>
                <label className={styles.filterLabel}>&nbsp;</label>
                <button onClick={toggleMapVisibility} className={styles.mapButton}>
                  {isMapVisible ? 'Скрыть карту' : 'Показать карту'}
                </button>
              </div>

              <div className={styles.filterItem}>
                <label className={styles.filterLabel}>Тип соревнования</label>
                <select
                    name="competitionType"
                    value={filters.competitionType}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                >
                  <option value="">Все типы</option>
                  <option>Чемпионат</option>
                  <option>Межрегиональный</option>
                  <option>Районный</option>
                  <option>Кубок</option>
                </select>
              </div>

              <div className={styles.filterItem}>
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

              <div className={styles.filterItem}>
                <label className={styles.filterLabel}>Дата от</label>
                <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                />
              </div>

              <div className={styles.filterItem}>
                <label className={styles.filterLabel}>Дата до</label>
                <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                />
              </div>
            </div>
          </div>

          {/* Карта */}
          {isMapVisible && <YandexMap events={filteredCompetitions} />}

          {/* Таблица */}
          <div className={styles.competitionTable}>
            <table>
              <thead>
              <tr>
                <th>#</th>
                <th>Дата</th>
                <th>Название соревнования</th>
                <th>Место проведения</th>
                <th>Кол-во участников</th>
              </tr>
              </thead>
              <tbody>
              {filteredCompetitions.map((competition) => (
                  <tr key={competition.eventNumber}>
                    <td className={styles.numberCell}>{competition.eventNumber}</td>
                    <td className={styles.dateCell}>
                      <div className={styles.dateRange}>
                        {competition.startDay} - {competition.endDay}
                      </div>
                      <div className={styles.weekDays}>{competition.weekDays}</div>
                    </td>
                    <td className={styles.titleCell}>
                      <div className={styles.competitionTitle}>
                        {competition.sport} - {competition.date}
                      </div>
                      <div className={styles.categories}>
                        {competition.categories.map((category, idx) => (
                            <span key={idx} className={styles.category}>
                          {category}
                        </span>
                        ))}
                      </div>
                    </td>
                    <td>{competition.city}</td>
                    <td>{competition.participants}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default Page;
