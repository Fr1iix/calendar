const { DataTypes} = require('sequelize');
const sequelize = require('../../db');

// Пользователи и информация о них
const User = sequelize.define('User', {
    idUser: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING, allowNull: false },
    activated: { type: DataTypes.BOOLEAN, defaultValue: false },
    dateRegister: { type: DataTypes.DATE },
    isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false, },
    verificationCode: { type: DataTypes.STRING, allowNull: true, },

}, { tableName: 'User', timestamps: false });

const UserInfo = sequelize.define('UserInfo', {
    idUserInfo: { type: DataTypes.INTEGER, primaryKey: true },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    middleName: { type: DataTypes.STRING },
    age: { type: DataTypes.INTEGER },
}, { tableName: 'UserInfo', timestamps: false });

const UserRating = sequelize.define('UserRating', {
    idRating: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idUser: { type: DataTypes.INTEGER },
    eventsParticipated: { type: DataTypes.INTEGER, defaultValue: 0 },
    ratingScore: { type: DataTypes.FLOAT },
    lastUpdated: { type: DataTypes.DATE},
}, { tableName: 'UserRating', timestamps: false });

const RatingHistory = sequelize.define('RatingHistory', {
    idHistory: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idUser: { type: DataTypes.INTEGER },
    idEvent: { type: DataTypes.INTEGER },
    ratingEarned: { type: DataTypes.FLOAT },
    dateEarned: { type: DataTypes.DATE},
}, { tableName: 'RatingHistory', timestamps: false });

// События
const Event = sequelize.define('Event', {
    idEvent: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE },
    userCount: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'Event', timestamps: false });

const Commands = sequelize.define('Commands', {
    idCommands: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Commands', timestamps: false });

const CommandEvent = sequelize.define('CommandEvent', {
    idCommandEvent: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { tableName: 'CommandEvent', timestamps: false });

const UserInCommand = sequelize.define('UserInCommand', {
    idUserInCommand: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { tableName: 'UserInCommand', timestamps: false });

const HistoryUser = sequelize.define('HistoryUser', {
    idHistory: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { tableName: 'HistoryUser', timestamps: false });

// Роли и права доступа
const Role = sequelize.define('Role', {
    idRole: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Role', timestamps: false });

const Permission = sequelize.define('Permission', {
    idPermission: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    permission: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Permission', timestamps: false });

const RolePermission = sequelize.define('RolePermission', {
    idRolePermission: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idRole: { type: DataTypes.INTEGER },
    idPermission: { type: DataTypes.INTEGER },
    scope: { type: DataTypes.STRING},
    startDate: {type: DataTypes.DATE},
    endDate: {type: DataTypes.DATE},
}, { tableName: 'RolePermission', timestamps: false });

const EntityPermission = sequelize.define('EntityPermission', {
    idEntityPermission: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idEntity: { type: DataTypes.INTEGER },
    idPermission: { type: DataTypes.INTEGER },
    entityType: { type: DataTypes.STRING },
}, { tableName: 'EntityPermission', timestamps: false });

// Адреса
const Address = sequelize.define('Address', {
    idAddress: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { tableName: 'Address', timestamps: false });

const City = sequelize.define('City', {
    idCity: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    city: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'City', timestamps: false });

const Region = sequelize.define('Region', {
    idRegion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    region: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Region', timestamps: false });

const Country = sequelize.define('Country', {
    idCountry: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    country: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Country', timestamps: false });

const AnalyticsRegion = sequelize.define('AnalyticsRegion', {
    idAnalyticsRegion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    totalEvents: { type: DataTypes.INTEGER, defaultValue: 0 },
    totalParticipants: { type: DataTypes.INTEGER, defaultValue: 0 },
    year: {type: DataTypes.INTEGER},
    totalWins: {type: DataTypes.INTEGER},
    lastUpdated: {type: DataTypes.DATE},
}, { tableName: 'AnalyticsRegion', timestamps: false });

const AnalyticsUser = sequelize.define('AnalyticsUser', {
    idAnalyticsUser: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    totalEvents: { type: DataTypes.INTEGER, defaultValue: 0 },
    totalParticipants: { type: DataTypes.INTEGER, defaultValue: 0 },
    year: {type: DataTypes.INTEGER},
    totalWins: {type: DataTypes.INTEGER},
    lastUpdated: {type: DataTypes.DATE},
}, { tableName: 'AnalyticsUser', timestamps: false });

const AnalyticsTeam = sequelize.define('AnalyticsTeam', {
    idAnalyticsTeam: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    totalEvents: { type: DataTypes.INTEGER, defaultValue: 0 },
    totalParticipants: { type: DataTypes.INTEGER, defaultValue: 0 },
    year: {type: DataTypes.INTEGER},
    totalWins: {type: DataTypes.INTEGER},
    lastUpdated: {type: DataTypes.DATE},
}, { tableName: 'AnalyticsTeam', timestamps: false });

// Уведомления
const Notification = sequelize.define('Notification', {
    idNotification: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    notificationType: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING },
    sendDate: {type: DataTypes.DATE},
}, { tableName: 'Notification', timestamps: false });

const NotificationUsers = sequelize.define('NotificationUsers', {
    idNotificationUsers: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { tableName: 'NotificationUsers', timestamps: false });

// Таблица Feedback (отзывы)
const Feedback = sequelize.define('Feedback', {
    idFeedback: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rating: { type: DataTypes.FLOAT, allowNull: false },
    comment: { type: DataTypes.TEXT },
    createDate: { type: DataTypes.DATE},
}, { tableName: 'Feedback', timestamps: false });

// Таблица Budget (бюджет)
const Budget = sequelize.define('Budget', {
    idBudget: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    totalBudget: { type: DataTypes.FLOAT, allowNull: false },
    actualBudget: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING },
}, { tableName: 'Budget', timestamps: false });

const BudgetItem = sequelize.define('Budget', {
    idBudget: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    category: { type: DataTypes.STRING, allowNull: false },
    plannedCost: { type: DataTypes.FLOAT, allowNull: false },
    actualCost: { type: DataTypes.FLOAT },
}, { tableName: 'Budget', timestamps: false });

// Таблица News (новости)
const News = sequelize.define('News', {
    idNews: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    img: {type: DataTypes.STRING, allowNull: false},
}, { tableName: 'News', timestamps: false });

// Таблица Result (результаты событий)
const Result = sequelize.define('Result', {
    idResult: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pointsEarned: { type: DataTypes.INTEGER },
    points: { type: DataTypes.INTEGER },
}, { tableName: 'Result', timestamps: false });

// Таблица Protocol (протокол)
const Protocol = sequelize.define('Protocol', {
    idProtocol: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    documentLink: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    condition: { type: DataTypes.STRING },
    createDate: { type: DataTypes.DATE},
}, { tableName: 'Protocol', timestamps: false });

// Таблица Gender (пол участников)
const Gender = sequelize.define('Gender', {
    idGender: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    gender: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Gender', timestamps: false });

// Таблица UserPlace (место пользователя в соревнованиях)
const UserPlace = sequelize.define('UserPlace', {
    idUserPlace: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { tableName: 'UserPlace', timestamps: false });

const RequestEvent = sequelize.define('RequestEvent', {
    idRequestEvent: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idEvent: { type: DataTypes.INTEGER, allowNull: false }, // Ссылка на событие
    idUser: { type: DataTypes.INTEGER, allowNull: false }, // Ссылка на пользователя
    requestStatus: { type: DataTypes.STRING, allowNull: false }, // Статус запроса (например, 'Ожидает', 'Одобрено', 'Отклонено')
    requestDate: { type: DataTypes.DATE }, // Дата запроса
}, { tableName: 'RequestEvent', timestamps: false });

const ListOfUserinEvent = sequelize.define('ListOfUserinEvent', {
    idListOfUserinEvent: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idRequestEvent: { type: DataTypes.INTEGER, allowNull: false }, // Ссылка на событие
    idUser: { type: DataTypes.INTEGER, allowNull: false }, // Ссылка на пользователя
}, { tableName: 'ListOfUserinEvent', timestamps: false });

const RegionScore = sequelize.define('RegionScore', {
    idRegionScore: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    totalPoints: { type: DataTypes.INTEGER, allowNull: false },
    LastUpdated: { type: DataTypes.DATE },
}, { tableName: 'RegionScore', timestamps: false });

// Связь пользователей с информацией
User.hasOne(UserInfo, { foreignKey: 'idUser' });
UserInfo.belongsTo(User, { foreignKey: 'idUser' });

User.hasOne(Result, { foreignKey: 'idUser' });
Result.belongsTo(User, { foreignKey: 'idUser' });

Gender.hasOne(UserInfo, { foreignKey: 'idGender' });
UserInfo.belongsTo(Gender, { foreignKey: 'idGender' })

Gender.hasOne(Event, { foreignKey: 'idGender' });
Event.belongsTo(Gender, { foreignKey: 'idGender' })

Address.hasOne(Event, { foreignKey: 'idAddress' });
Event.belongsTo(Address, { foreignKey: 'idAddress' })

Address.hasOne(UserInfo, { foreignKey: 'idAddress' });
UserInfo.belongsTo(Address, { foreignKey: 'idAddress' })

// Связь пользователей с рейтингами
User.hasOne(UserRating, { foreignKey: 'idUser' });
UserRating.belongsTo(User, { foreignKey: 'idUser' });

// Связь Feedback с пользователями и событиями
Feedback.belongsTo(User, { foreignKey: 'idUser' });
Feedback.belongsTo(Event, { foreignKey: 'idEvent' });
User.hasMany(Feedback, { foreignKey: 'idUser' });
Event.hasMany(Feedback, { foreignKey: 'idEvent' });

// Связь Budget с событиями
Event.hasOne(Budget, { foreignKey: 'idEvent' });
Budget.belongsTo(Event, { foreignKey: 'idEvent' });

Budget.hasOne(BudgetItem, { foreignKey: 'idBudget' });
BudgetItem.belongsTo(Budget, { foreignKey: 'idBudget' });

// Связь News с событиями
Event.hasMany(News, { foreignKey: 'idEvent' });
News.belongsTo(Event, { foreignKey: 'idEvent' });

// Связь Result с командами и событиями
Commands.hasOne(Result, { foreignKey: 'idCommands' });
Result.belongsTo(Commands, { foreignKey: 'idCommands' });

Result.belongsTo(Event, { foreignKey: 'idEvent' });
Event.hasMany(Result, { foreignKey: 'idEvent' });

Result.hasOne(UserRating, { foreignKey: 'idUser' });
UserRating.belongsTo(Result, { foreignKey: 'idUser' });

Region.hasOne(Region, { foreignKey: 'idRegion' });
Result.belongsTo(Region, { foreignKey: 'idRegion' });

UserRating.hasOne(RatingHistory, { foreignKey: 'idUser' });
RatingHistory.belongsTo(UserRating, { foreignKey: 'idUser' });

Event.hasOne(RatingHistory, { foreignKey: 'idEvent' });
RatingHistory.belongsTo(Event, { foreignKey: 'idEvent' });

// Связь Protocol с событиями
Event.hasOne(Protocol, { foreignKey: 'idEvent' });
Protocol.belongsTo(Event, { foreignKey: 'idEvent' });

Protocol.hasOne(Result, { foreignKey: 'idProtocol' });
Result.belongsTo(Protocol, { foreignKey: 'idProtocol' });

// Связь AnalyticsTeam с командами
AnalyticsTeam.belongsTo(Commands, { foreignKey: 'idCommands' });
Commands.hasOne(AnalyticsTeam, { foreignKey: 'idCommands' });

AnalyticsRegion.belongsTo(Region, { foreignKey: 'idRegion' });
Region.hasOne(AnalyticsRegion, { foreignKey: 'idRegion' });

// Связь UserPlace с пользователями и событиями
User.hasOne(UserPlace, { foreignKey: 'idUser' });
UserPlace.belongsTo(User, { foreignKey: 'idUser' });

UserPlace.hasOne(Result, { foreignKey: 'idUserPlace' });
Result.belongsTo(UserPlace, { foreignKey: 'idUserPlace' });

RequestEvent.belongsTo(Event, { foreignKey: 'idEvent' }); // Связь с таблицей Event
RequestEvent.belongsTo(User, { foreignKey: 'idUser'}); // Связь с таблицей User

ListOfUserinEvent.belongsTo(RequestEvent, { foreignKey: 'idRequestEvent'}); // Связь с таблицей Event
ListOfUserinEvent.belongsTo(User, { foreignKey: 'idUser'}); // Связь с таблицей User

Role.hasOne(EntityPermission, {foreignKey: 'idRole'})
EntityPermission.belongsTo(Role, {foreignKey: 'idRole'}) //связь с таблице Role

Permission.hasOne(EntityPermission, {foreignKey: 'idPermission'})
EntityPermission.belongsTo(Permission, {foreignKey: 'idPermission'})

Role.hasOne(RolePermission, {foreignKey: 'idRole'})
RolePermission.belongsTo(Role, {foreignKey: 'idRole'}) //связь с таблице Role

Permission.hasOne(RolePermission, {foreignKey: 'idPermission'})
RolePermission.belongsTo(Permission, {foreignKey: 'idPermission'})

User.hasOne(AnalyticsUser,{foreignKey: 'idUser'})
AnalyticsUser.belongsTo(User, {foreignKey: 'idUser'})

Commands.hasOne(CommandEvent, {foreignKey: 'idCommands'})
CommandEvent.belongsTo(Commands, {foreignKey: 'idCommands'})

Commands.hasOne(UserInCommand, {foreignKey: 'idCommands'})
UserInCommand.belongsTo(Commands, {foreignKey: 'idCommands'})

User.hasOne(UserInCommand, {foreignKey: 'idUser'})
UserInCommand.belongsTo(User, {foreignKey: 'idUser'})

User.hasOne(HistoryUser, {foreignKey: 'idUser'})
HistoryUser.belongsTo(User, {foreignKey: 'idUser'})

User.hasOne(NotificationUsers, {foreignKey: 'idUser'})
NotificationUsers.belongsTo(User, {foreignKey: 'idUser'})

Notification.hasOne(NotificationUsers, {foreignKey: 'idNotification'})
NotificationUsers.belongsTo(Notification, {foreignKey: 'idNotification'})

Event.hasOne(HistoryUser, {foreignKey: 'idEvent'})
HistoryUser.belongsTo(Event, {foreignKey: 'idEvent'})

Event.hasOne(CommandEvent, {foreignKey: 'idEvent'})
CommandEvent.belongsTo(Event, {foreignKey: 'idEvent'})

Country.hasOne(Address, {foreignKey: 'idCountry'})
Address.belongsTo(Country, {foreignKey: 'idCountry'})

City.hasOne(Address, {foreignKey: 'idCity'})
Address.belongsTo(City, {foreignKey: 'idCity'})

Region.hasOne(Address, {foreignKey: 'idRegion'})
Address.belongsTo(Region, {foreignKey: 'idRegion'})

Region.hasOne(RegionScore, {foreignKey: 'idRegion'})
RegionScore.belongsTo(Region, {foreignKey: 'idRegion'})




// Экспорт всех моделей
module.exports = {
    sequelize,
    User,
    UserInfo,
    UserRating,
    RatingHistory,
    Event,
    Commands,
    CommandEvent,
    HistoryUser,
    Role,
    Permission,
    RolePermission,
    EntityPermission,
    Address,
    City,
    Region,
    Country,
    AnalyticsRegion,
    Notification,
    Feedback,
    Budget,
    BudgetItem,
    News,
    Result,
    Protocol,
    Gender,
    AnalyticsTeam,
    UserPlace,
    RequestEvent,
    ListOfUserinEvent,
    AnalyticsUser,
    UserInCommand,
    NotificationUsers,
    RegionScore,
};