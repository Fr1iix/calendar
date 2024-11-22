const ApiError = require('../error/ApiError');
const {EventTypes} = require('../models/models')

class EventTypesController{
    async create(req,res,next){
        try{
            let{name} = req.body
            const eventtypes = await EventTypes.create({name});
            return res.json(eventtypes)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteEventTypes(req,res){
        const id = req.params.id
        await EventTypes.destroy({where: {id}})
    }

    async getAllEventTypes(req, res){
        const AllTrip = await EventTypes.findAll
        return res.json(AllTrip)
    }

    async getOneEventTypes(req, res){
        const id = req.params.id
        const OneTrip = await EventTypes.findByPk(id)
        return res.json(OneTrip)
    }
}

module.exports = new EventTypesController