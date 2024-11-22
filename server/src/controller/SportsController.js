const { Sports } = require('../models/models');

module.exports = {
    async getAll(req, res) {
        try {
            const sports = await Sports.findAll();
            res.json(sports);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const sport = await Sports.findByPk(id);
            if (!sport) return res.status(404).json({ message: 'Sport not found' });
            res.json(sport);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const newSport = await Sports.create(req.body);
            res.status(201).json(newSport);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const [updated] = await Sports.update(req.body, { where: { id } });
            if (!updated) return res.status(404).json({ message: 'Sport not found' });
            res.json({ message: 'Sport updated successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Sports.destroy({ where: { id } });
            if (!deleted) return res.status(404).json({ message: 'Sport not found' });
            res.json({ message: 'Sport deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
