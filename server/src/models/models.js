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
// Обновленная модель событий
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
    startTime: { type: DataTypes.TIME },
    endTime: { type: DataTypes.TIME },
    latitude: { type: DataTypes.FLOAT },
    longitude: { type: DataTypes.FLOAT },
    registrationLink: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'planned' }, // Статус: planned, ongoing, completed, canceled, rescheduled
    lastUpdated: { type: DataTypes.DATE }, // Дата последнего обновления
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
    userId: { type: DataTypes.INTEGER }, // Идентификатор пользователя
    eventId: { type: DataTypes.INTEGER }, // Идентификатор события
}, { timestamps: false });

const Notifications = sequelize.define('notifications', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false }, // Ссылка на пользователя
    eventId: { type: DataTypes.INTEGER, allowNull: false }, // Ссылка на событие
    type: { type: DataTypes.STRING, defaultValue: 'new_event' }, // Тип уведомления: 'new_event' или 'update'
    message: { type: DataTypes.STRING, allowNull: false }, // Сообщение
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false }, // Прочитано ли уведомление
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

User.hasMany(Notifications);
Notifications.belongsTo(User);

Events.hasMany(Notifications);
Notifications.belongsTo(Events);

module.exports = {
    Sports,
    Disciplines,
    EventTypes,
    Events,
    User,
    UserInfo,
    Subscriptions,
    Notifications,
};