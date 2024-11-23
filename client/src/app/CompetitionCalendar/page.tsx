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
    eventNumber: 123456789012345, // Add eventNumber here
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
    eventNumber: 2, // Add eventNumber here
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
          {/* Фильтры */}
          <div className={styles.filterSection}>
            <h2 className={styles.filterTitle}>Фильтры</h2>
            <div className={styles.filterGrid}>
              {/* Вид спорта */}
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

              {/* Дисциплина */}
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

              {/* Программа */}
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

              {/* Место проведения */}
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

              {/* Минимальное число участников */}
              <div>
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

              {/* Пол/Возраст */}
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

              {/* Тип соревнования */}
              <div>
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

              {/* Дата от */}
              <div>
                <label className={styles.filterLabel}>Дата от</label>
                <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    className={styles.filterInput}
                />
              </div>

              {/* Дата до */}
              <div>
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

          {/* Кнопка для скрытия/раскрытия карты */}
          <button onClick={toggleMapVisibility} className={styles.toggleMapButton}>
            {isMapVisible ? 'Скрыть карту' : 'Показать карту'}
          </button>

          {/* Карта с отфильтрованными соревнованиями */}
          {isMapVisible && <YandexMap events={filteredCompetitions} />}

          {/* Таблица соревнований */}
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
                    {/* Use eventNumber here */}
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
                    <td className={styles.venueCell}>
                      <div className={styles.city}>{competition.city}</div>
                      <div className={styles.organizer}>
                        Организатор: {competition.organizer}
                      </div>
                    </td>
                    <td className={styles.participantsCell}>
                      {competition.participants}
                    </td>
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
