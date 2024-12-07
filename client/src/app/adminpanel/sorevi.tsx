import React from "react";
import styles from "./sorevi.module.css";

// Интерфейс для описания соревнований
interface Competition {
    date: string;
    sport: string;
    startDay: string;
    endDay: string;
    weekDays: string;
    venue: string;
    participants: number;
    city: string;
    categories: string[];
}

// Интерфейс для пропсов компонента
interface CompetitionTableProps {
    competitions: Competition[];
}

// Компонент Sorevi
const Sorevi: React.FC<CompetitionTableProps> = ({ competitions }) => {
    if (!Array.isArray(competitions) || competitions.length === 0) {
        return <div>Нет доступных данных для отображения</div>;
    }

    return (
        <div className={styles.competitionTable}>
            <table>
                <thead>
                <tr>
                    <th>Дата</th>
                    <th>Название соревнования</th>
                    <th>Место проведения</th>
                    <th>Кол-во участников</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {competitions.map((competition, index) => (
                    <tr key={index}>
                        <td className={styles.dateCell}>
                            <div className={styles.dateRange}>
                                {competition.startDay}
                                <p>-</p>
                                {competition.endDay}
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
                        <td>
                            <button className={styles.joinButton}>Принять</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

// Моковые данные для соревнований
const mockCompetitions: Competition[] = [
    {
        date: "2024-12-10",
        sport: "Футбол",
        startDay: "10 декабря",
        endDay: "15 декабря",
        weekDays: "Пн - Пт",
        venue: "Стадион 'Олимпийский'",
        participants: 20,
        city: "Москва",
        categories: ["Мужчины", "Женщины"],
    },
    {
        date: "2024-12-20",
        sport: "Баскетбол",
        startDay: "20 декабря",
        endDay: "25 декабря",
        weekDays: "Ср - Вс",
        venue: "Спорткомплекс 'Дружба'",
        participants: 15,
        city: "Санкт-Петербург",
        categories: ["Юниоры", "Профессионалы"],
    },
    {
        date: "2024-12-28",
        sport: "Волейбол",
        startDay: "28 декабря",
        endDay: "30 декабря",
        weekDays: "Сб - Пн",
        venue: "Дворец спорта",
        participants: 12,
        city: "Казань",
        categories: ["Любители", "Мастера"],
    },
];

// Используем компонент с моковыми данными
const SoreviPage: React.FC = () => {
    return <Sorevi competitions={mockCompetitions} />;
};

export default SoreviPage;
