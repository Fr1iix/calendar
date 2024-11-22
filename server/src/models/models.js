const sequelize = require('../../db');
const { DataTypes } = require('sequelize');

// Таблица видов спорта
const Sports = sequelize.define('sports', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { timestamps: false });

// Таблица дисциплин
const Disciplines = sequelize.define('disciplines', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false });

// Таблица типов событий
const EventTypes = sequelize.define('event_types', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { timestamps: false });

// Таблица событий
const Events = sequelize.define('events', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.TEXT },
    city: { type: DataTypes.STRING },
    region: { type: DataTypes.STRING },
    venue: { type: DataTypes.STRING }, // Название арены/места проведения
    participantsCount: { type: DataTypes.INTEGER },
    gender: { type: DataTypes.STRING },
    ageGroup: { type: DataTypes.STRING },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE },
    startTime: { type: DataTypes.TIME }, // Добавлено время начала
    endTime: { type: DataTypes.TIME },   // Добавлено время окончания
    latitude: { type: DataTypes.FLOAT }, // Геолокация
    longitude: { type: DataTypes.FLOAT },
    registrationLink: { type: DataTypes.STRING },
    participationFee: { type: DataTypes.FLOAT }, // Стоимость участия
    status: { type: DataTypes.STRING, defaultValue: 'planned' }, // Статус: planned, ongoing, completed, canceled
}, { timestamps: false });

// Таблица пользователей
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.CHAR },
    role: { type: DataTypes.STRING, defaultValue: 'user' }
}, { timestamps: false });

// Дополнительная информация о пользователе
const UserInfo = sequelize.define('user_info', {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    middleName: { type: DataTypes.STRING },
    birthday: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    age: { type: DataTypes.INTEGER },
}, { timestamps: false });

// Таблица подписок
const Subscriptions = sequelize.define('subscriptions', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    subscriptionType: { type: DataTypes.STRING }, // Подписка на событие, дисциплину и т.д.
}, { timestamps: false });

// Установление связей
Sports.hasMany(Disciplines);
Disciplines.belongsTo(Sports);

Disciplines.hasMany(Events);
Events.belongsTo(Disciplines);

EventTypes.hasMany(Events);
Events.belongsTo(EventTypes);

User.hasMany(Subscriptions);
Subscriptions.belongsTo(User);

Events.hasMany(Subscriptions);
Subscriptions.belongsTo(Events);

User.hasOne(UserInfo, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserInfo.belongsTo(User);

module.exports = {
    Sports,
    Disciplines,
    EventTypes,
    Events,
    User,
    UserInfo,
    Subscriptions,
};