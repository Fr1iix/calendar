const ApiError = require('../error/ApiError');
const {Event, pdfParseResult, Subscriptions, User} = require('../models/models');
const sendEmail = require('../utils/sendEmail'); // Импортируем функцию для отправки email
const cron = require('node-cron');
const {Op} = require('sequelize'); // Для реализации cron задач (например, для напоминаний)

// Функция для парсинга данных из текста
function parseEventData(text) {
    return {
        id: text.match(/\b\d{16}\b/)?.[0] || null,
        competitionName: text.match(/^\D+/m)?.[0]?.trim() || null,
        gender: text.match(/девочки|мальчики|девушки|юниоры|юниорки|мужчины|женщины/gi)?.join(', ') || null,
        age: text.match(/(\d{2}-\d{2} лет)/g)?.join(', ') || null,
        startDate: text.match(/\b\d{2}\.\d{2}\.\d{4}\b/)?.[0]?.split(' ')[0] || null,
        endDate: text.match(/\b\d{2}\.\d{2}\.\d{4}\b.*?$/)?.[0]?.split(' ')[1] || null,
        country: text.match(/РОССИЯ/i)?.[0] || null,
        region: text.match(/[А-ЯЁ\-]+ ОБЛАСТЬ|РЕСПУБЛИКА [А-ЯЁ\-]+/i)?.[0] || null,
        town: text.match(/г\. [^,]+|[а-яё]+ деревня|[а-яё]+ село/i)?.[0] || null,
        participantsCount: parseInt(text.match(/\b\d{3,}\b/)?.[0], 10) || null,
        registrationLink: null
    };
}

class EventController {
    // Метод для обработки текста и записи данных в таблицу events
    async processPdfData(req, res) {
        try {
            // 1. Извлекаем текст из таблицы pdfParseResult
            const pdfData = await pdfParseResult.findAll();
            if (!pdfData.length) {
                return res.status(404).json({message: 'Нет данных для обработки.'});
            }

            let processedCount = 0;

            // 2. Обрабатываем каждую запись текста
            for (const entry of pdfData) {
                const rawText = entry.text;

                // Разделяем текст на записи (каждая начинается с ID)
                const entries = rawText.split(/\n(?=\d{16})/); // Каждая запись начинается с ID

                for (const record of entries) {
                    const eventData = parseEventData(record);

                    // 3. Проверяем данные и записываем их в таблицу events
                    if (eventData.id && eventData.competitionName) {
                        await Event.upsert({
                            id: eventData.id,
                            competitionName: eventData.competitionName,
                            gender: eventData.gender,
                            age: eventData.age,
                            startDate: eventData.startDate,
                            endDate: eventData.endDate,
                            country: eventData.country,
                            region: eventData.region,
                            town: eventData.town,
                            participantsCount: eventData.participantsCount,
                            registrationLink: eventData.registrationLink,
                        });
                        processedCount++;
                    }
                }
            }

            return res.status(200).json({message: `Обработано ${processedCount} записей.`});
        } catch (error) {
            console.error('Ошибка при обработке данных:', error); // Добавляем логирование ошибки
            return res.status(500).json({
                message: 'Ошибка сервера',
                error: error.message || error, // Отправляем сообщение об ошибке
            });
        }
    }

    async create(req,res,next){
        try{
            let{id,competitionName,gender,age,startDate,endDate,country,region,town,participantsCount,registrationLink} = req.body
            const event = await Event.create({id,competitionName,gender,age,startDate,endDate,country,region,town,participantsCount,registrationLink});
            return res.json(event)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteEvent(req, res) {
        const id = req.params.id;
        await Event.destroy({where: {id}});
        res.json({message: `Event with id ${id} deleted`});
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
            res.status(500).json({error: 'Не удалось получить данные'});
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
            const users = await User.findAll({attributes: ['email']});
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
                where: {eventId: event.id},
                include: [{model: User, attributes: ['email']}]
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
        const {id} = req.params;
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
        const {id} = req.params;

        try {
            const event = await Event.findByPk(id);
            if (!event) {
                return next(ApiError.badRequest('Event not found'));
            }

            event.status = 'canceled';
            await event.save();

            // Отправляем уведомление об отмене события
            await this.sendNotificationAboutChange(event);

            return res.json({message: `Event with id ${id} has been canceled`});
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
                where: {eventId: event.id},
                include: [{model: User, attributes: ['email']}]
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
