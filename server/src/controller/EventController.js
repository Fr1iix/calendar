const ApiError = require('../error/ApiError');
const { Event } = require('../models/models');

class EventController {
    async create(req, res, next) {
        try {
            const {
                title, details, city, region, venue,
                participantsCount, gender, ageGroup,
                startDate, endDate, startTime, endTime,
                latitude, longitude, registrationLink, status
            } = req.body;

            const event = await Event.create({
                title, details, city, region, venue,
                participantsCount, gender, ageGroup,
                startDate, endDate, startTime, endTime,
                latitude, longitude, registrationLink, status
            });
            return res.json(event);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async createFromPdf(req, res, next) {
        try {
            const { events } = req.body; // Ожидаем массив событий
            if (!Array.isArray(events)) {
                return next(ApiError.badRequest('Invalid input: Expected an array of events'));
            }

            // Сохраняем все события в базу данных
            const createdEvents = await Event.bulkCreate(events);
            return res.json({
                message: 'Events created successfully',
                createdEvents,
            });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteEvent(req, res) {
        const id = req.params.id;
        await Event.destroy({ where: { id } });
        res.json({ message: `Event with id ${id} deleted` });
    }

    async getAllEvent(req, res) {
        try {
            const events = await Event.findAll({
                attributes: [
                    'title',
                    'details',
                    'latitude',
                    'longitude',
                    'startDate',
                    'endDate',
                    'participantsCount',
                    'city',
                ],
            });
            res.json(events);
        } catch (error) {
            console.error('Ошибка получения событий:', error.message);
            res.status(500).json({ error: 'Не удалось получить данные' });
        }
    }

    async getOneEvent(req, res) {
        const id = req.params.id;
        const oneEvent = await Event.findByPk(id);
        return res.json(oneEvent);
    }
}

module.exports = new EventController();