const ApiError = require('../error/ApiError');
const {Subscriptions} = require('../models/models')

class SubscriptionsController{
    async create(req,res,next){
        try{
            let{subscriptionType} = req.body
            const subscriptions = await Subscriptions.create({subscriptionType});
            return res.json(subscriptions)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteSubscriptions(req){
        const id = req.params.id
        await Subscriptions.destroy({where: {id}})
    }

    async getAllSubscriptions(req, res){
        const AllSubscriptions = await Subscriptions.findAll
        return res.json(AllSubscriptions)
    }

    async getOneSubscriptions(req, res){
        const id = req.params.id
        const OneSubscriptions = await Subscriptions.findByPk(id)
        return res.json(OneSubscriptions)
    }
}

module.exports = new SubscriptionsController