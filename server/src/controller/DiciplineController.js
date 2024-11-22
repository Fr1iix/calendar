const { Disciplines } = require('../models/models');

module.exports = {
    async getAll(req, res) {
        try {
            const disciplines = await Disciplines.findAll();
            res.json(disciplines);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const discipline = await Disciplines.findByPk(id);
            if (!discipline) return res.status(404).json({ message: 'Discipline not found' });
            res.json(discipline);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const newDiscipline = await Disciplines.create(req.body);
            res.status(201).json(newDiscipline);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const [updated] = await Disciplines.update(req.body, { where: { id } });
            if (!updated) return res.status(404).json({ message: 'Discipline not found' });
            res.json({ message: 'Discipline updated successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Disciplines.destroy({ where: { id } });
            if (!deleted) return res.status(404).json({ message: 'Discipline not found' });
            res.json({ message: 'Discipline deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
