const { Subscriptions } = require('../models/models');

module.exports = {
    async getAll(req, res) {
        try {
            const subscriptions = await Subscriptions.findAll();
            res.json(subscriptions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const subscription = await Subscriptions.findByPk(id);
            if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
            res.json(subscription);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async create(req, res) {
        try {
            const newSubscription = await Subscriptions.create(req.body);
            res.status(201).json(newSubscription);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const [updated] = await Subscriptions.update(req.body, { where: { id } });
            if (!updated) return res.status(404).json({ message: 'Subscription not found' });
            res.json({ message: 'Subscription updated successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Subscriptions.destroy({ where: { id } });
            if (!deleted) return res.status(404).json({ message: 'Subscriptions not found' });
            res.json({ message: 'Subscriptions deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};