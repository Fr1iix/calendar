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
const Event = sequelize.define('events', {
    id: { type: DataTypes.STRING, primaryKey: true, autoIncrement: true },
    competitionName: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    age: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    region: { type: DataTypes.STRING },
    town: { type: DataTypes.STRING },
    participantsCount: { type: DataTypes.INTEGER },
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

const pdfParseResult = sequelize.define('pdfParseResult', {
    text: { type: DataTypes.TEXT },
});

// Установление связей
Sports.hasMany(Disciplines);
Disciplines.belongsTo(Sports);

Disciplines.hasMany(Event);
Event.belongsTo(Disciplines);

EventTypes.hasMany(Event);
Event.belongsTo(EventTypes);

User.hasMany(Subscriptions);
Subscriptions.belongsTo(User);

Event.hasMany(Subscriptions);
Subscriptions.belongsTo(Event);

User.hasOne(UserInfo, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserInfo.belongsTo(User);

module.exports = {
    Sports,
    Disciplines,
    EventTypes,
    Event,
    User,
    UserInfo,
    Subscriptions,
    pdfParseResult,
};