const { Events } = require('../models/models');

module.exports = {
    async getAll(req, res) {
        try {
            const events = await Events.findAll();
            res.json(events);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const event = await Events.findByPk(id);
            if (!event) return res.status(404).json({ message: 'Event not found' });
            res.json(event);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const newEvent = await Events.create(req.body);
            res.status(201).json(newEvent);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const [updated] = await Events.update(req.body, { where: { id } });
            if (!updated) return res.status(404).json({ message: 'Event not found' });
            res.json({ message: 'Event updated successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Events.destroy({ where: { id } });
            if (!deleted) return res.status(404).json({ message: 'Event not found' });
            res.json({ message: 'Event deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};