const ApiError = require('../error/ApiError');
const { Event, User, Subscriptions } = require('../models/models');
const sendEmail = require('../utils/sendEmail');  // Импортируем функцию для отправки email
const cron = require('node-cron');
const {Op} = require("sequelize"); // Для реализации cron задач (например, для напоминаний)

class EventController {
    // Создание нового события
    async create(req, res, next) {
        try {
            const {
                title, details, city, region, venue,
                participantsCount, gender, ageGroup,
                startDate, endDate, startTime, endTime,
                latitude, longitude, registrationLink,
                lastNotified, status
            } = req.body;

            const event = await Event.create({
                title, details, city, region, venue,
                participantsCount, gender, ageGroup,
                startDate, endDate, startTime, endTime,
                latitude, longitude, registrationLink,
                lastNotified, status
            });

            // Отправляем уведомление всем пользователям
            await this.sendNotificationToAllUsers(event);

            return res.json(event);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Создание событий из PDF
    async createFromPdf(req, res, next) {
        try {
            const { events } = req.body;
            if (!Array.isArray(events)) {
                return next(ApiError.badRequest('Invalid input: Expected an array of events'));
            }

            const createdEvents = await Event.bulkCreate(events);

            // Отправляем уведомления всем пользователям о новых событиях
            for (let event of createdEvents) {
                await this.sendNotificationToAllUsers(event);
            }

            return res.json({
                message: 'Events created successfully',
                createdEvents,
            });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Удаление события
    async deleteEvent(req, res) {
        const id = req.params.id;
        await Event.destroy({ where: { id } });
        res.json({ message: `Event with id ${id} deleted` });
    }

    // Получение всех событий
    async getAllEvent(req, res) {
        try {
            const events = await Event.findAll({
                attributes: [
                    'title', 'details', 'latitude', 'longitude',
                    'startDate', 'endDate', 'participantsCount', 'city',
                ],
            });
            res.json(events);
        } catch (error) {
            console.error('Ошибка получения событий:', error.message);
            res.status(500).json({ error: 'Не удалось получить данные' });
        }
    }

    // Получение одного события
    async getOneEvent(req, res) {
        const id = req.params.id;
        const oneEvent = await Event.findByPk(id);
        return res.json(oneEvent);
    }

    // Метод для отправки уведомлений всем пользователям
    async sendNotificationToAllUsers(event) {
        try {
            const users = await User.findAll({ attributes: ['email'] });
            const emails = users.map(user => user.email);

            // Тема и текст уведомления
            const subject = `Новое событие: ${event.title}`;
            const text = `Здравствуйте!\n\nНа платформе появилось новое событие: ${event.title}. Подробности: ${event.details}.`;

            for (let email of emails) {
                await sendEmail(email, subject, text);
            }

            // Обновляем время последнего уведомления
            event.lastNotified = new Date();
            await event.save();
        } catch (error) {
            console.error('Ошибка при отправке уведомлений:', error);
        }
    }

    // Метод для отправки уведомлений об изменениях/переносах событий
    async sendNotificationAboutChange(event) {
        try {
            // Получаем пользователей, подписанных на это событие
            const subscribers = await Subscriptions.findAll({
                where: { eventId: event.id },
                include: [{ model: User, attributes: ['email'] }]
            });

            const emails = subscribers.map(sub => sub.User.email);

            // Тема и текст уведомления о переносе/изменении
            const subject = `Изменения в событии: ${event.title}`;
            const text = `Здравствуйте!\n\nСобытие "${event.title}" было изменено. Подробности: ${event.details}.`;

            for (let email of emails) {
                await sendEmail(email, subject, text);
            }

            // Обновляем время последнего уведомления
            event.lastNotified = new Date();
            await event.save();
        } catch (error) {
            console.error('Ошибка при отправке уведомлений:', error);
        }
    }

    // Метод для обновления события (перенос, изменение)
    async updateEvent(req, res, next) {
        const { id } = req.params;
        const updatedEventData = req.body;

        try {
            const event = await Event.findByPk(id);

            if (!event) {
                return next(ApiError.badRequest('Event not found'));
            }

            // Обновляем события
            await event.update(updatedEventData);

            // Отправляем уведомление об изменении события
            await this.sendNotificationAboutChange(event);

            return res.json(event);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Метод для отмены события
    async cancelEvent(req, res, next) {
        const { id } = req.params;

        try {
            const event = await Event.findByPk(id);
            if (!event) {
                return next(ApiError.badRequest('Event not found'));
            }

            event.status = 'canceled';
            await event.save();

            // Отправляем уведомление об отмене события
            await this.sendNotificationAboutChange(event);

            return res.json({ message: `Event with id ${id} has been canceled` });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // Метод для отправки напоминаний (например, за 24 часа до события)
    async sendReminder() {
        const events = await Event.findAll({
            where: {
                startDate: {
                    [Op.gte]: new Date(),
                    [Op.lt]: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // события, начинающиеся через 24 часа
                }
            }
        });

        for (let event of events) {
            const subscribers = await Subscriptions.findAll({
                where: { eventId: event.id },
                include: [{ model: User, attributes: ['email'] }]
            });

            const emails = subscribers.map(sub => sub.User.email);

            const subject = `Напоминание: ${event.title} скоро начинается!`;
            const text = `Напоминаем вам, что событие "${event.title}" начнется через 24 часа.\n\nДетали: ${event.details}\nДата: ${event.startDate}\nМесто: ${event.venue}`;

            for (let email of emails) {
                await sendEmail(email, subject, text);
            }
        }
    }
}

// Создание задачи cron для отправки напоминаний каждую ночь в 00:00
cron.schedule('0 0 * * *', async () => {
    const eventController = new EventController();
    await eventController.sendReminder();
});

module.exports = new EventController();
