"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Dashboard, Assignment, People, Event, NoteAdd } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import Neeews from "./neeews";
import UsersTable from "./UsersTable";
import Zayav from "./zayav";

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("statistics");

    useEffect(() => {
        const savedTab = localStorage.getItem("activeTab");
        if (savedTab) {
            setActiveTab(savedTab);
        }
    }, []);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        localStorage.setItem("activeTab", tab);
    };

    // Пример данных для статистики по месяцам
    const monthlyData = [
        { month: "Янв", users: 100, applications: 20, news: 5 },
        { month: "Фев", users: 120, applications: 30, news: 8 },
        { month: "Мар", users: 150, applications: 25, news: 10 },
        { month: "Апр", users: 200, applications: 40, news: 12 },
        { month: "Май", users: 250, applications: 50, news: 15 },
        { month: "Июн", users: 300, applications: 60, news: 20 },
        { month: "Июл", users: 350, applications: 70, news: 25 },
        { month: "Авг", users: 400, applications: 80, news: 30 },
        { month: "Сен", users: 450, applications: 90, news: 35 },
        { month: "Окт", users: 500, applications: 100, news: 40 },
        { month: "Ноя", users: 550, applications: 110, news: 45 },
        { month: "Дек", users: 600, applications: 120, news: 50 },
    ];

    // Данные для количества мероприятий
    const eventData = [
        { month: "Янв", events: 10 },
        { month: "Фев", events: 15 },
        { month: "Мар", events: 20 },
        { month: "Апр", events: 25 },
        { month: "Май", events: 30 },
        { month: "Июн", events: 35 },
        { month: "Июл", events: 40 },
        { month: "Авг", events: 45 },
        { month: "Сен", events: 50 },
        { month: "Окт", events: 55 },
        { month: "Ноя", events: 60 },
        { month: "Дек", events: 65 },
    ];

    // Данные для статистики по полу
    const genderData = [
        { name: "Мужчины", value: 400, color: "#0088FE" },
        { name: "Женщины", value: 300, color: "#FF8042" },
    ];

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <h2 className={styles.logoText}>Админ-панель</h2>
                <hr className={styles.separator} />
                <nav>
                    <ul className={styles.navList}>
                        <li
                            className={`${styles.navItem} ${activeTab === "statistics" ? styles.active : ""}`}
                            onClick={() => handleTabChange("statistics")}
                        >
                            <Dashboard className={styles.iconBlue}/> Статистика
                        </li>
                        <li
                            className={`${styles.navItem} ${activeTab === "Zayav" ? styles.active : ""}`}
                            onClick={() => handleTabChange("Zayav")}
                        >
                            <Event className={styles.iconPurple}/> Мероприятия
                        </li>

                        <li
                            className={`${styles.navItem} ${activeTab === "applications" ? styles.active : ""}`}
                            onClick={() => handleTabChange("applications")}
                        >
                            <Assignment className={styles.iconOrange}/> Заявки соревнований
                        </li>
                        <li
                            className={`${styles.navItem} ${activeTab === "users" ? styles.active : ""}`}
                            onClick={() => handleTabChange("users")}
                        >
                            <People className={styles.iconGreen}/> Пользователи
                        </li>
                        <li
                            className={`${styles.navItem} ${activeTab === "news" ? styles.active : ""}`}
                            onClick={() => handleTabChange("news")}
                        >
                            <NoteAdd className={styles.iconRed}/> Добавление новостей
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className={styles.content}>
                {activeTab === "statistics" && (
                    <Grid container spacing={3}>
                    <Grid item xs={12}>
                            <Card className={styles.statCard}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Общая статистика
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Card className={styles.infoCard}>
                                                <CardContent>
                                                    <Grid container alignItems="center">
                                                        <Grid item xs>
                                                            <Typography variant="body1" className={styles.number} style={{ display: "flex", alignItems: "center" }}>
                                                                <People style={{ fontSize: 40, color: "#0088FE", marginRight: 10 }} />
                                                                5200
                                                            </Typography>
                                                            <Typography variant="body1">Общее количество пользователей</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Card className={styles.infoCard}>
                                                <CardContent>
                                                    <Grid container alignItems="center">
                                                        <Grid item xs>
                                                            <Typography variant="body1" className={styles.number} style={{ display: "flex", alignItems: "center" }}>
                                                                <Event style={{ fontSize: 40, color: "#FF8042", marginRight: 10 }} />
                                                                120
                                                            </Typography>
                                                            <Typography variant="body1">Общее количество мероприятий</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} style={{ marginTop: 20 }}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="h6">Пользователи</Typography>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <BarChart data={monthlyData}>
                                                    <XAxis dataKey="month" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey="users" fill="#0088FE" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="h6">Заявки</Typography>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <BarChart data={monthlyData}>
                                                    <XAxis dataKey="month" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey="applications" fill="#FFBB28" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="h6">Новости</Typography>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <BarChart data={monthlyData}>
                                                    <XAxis dataKey="month" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey="news" fill="#FF8042" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6">Статистика по полу</Typography>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart>
                                                    <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                                        {genderData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6">Мероприятия</Typography>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <BarChart data={eventData}>
                                                    <XAxis dataKey="month" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey="events" fill="#82ca9d" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
                {activeTab === "users" && <UsersTable />}
                {activeTab === "news" && <Neeews />}
                {activeTab === "Zayav" && <Zayav />}
            </main>
        </div>
    );
}

export default AdminPage;