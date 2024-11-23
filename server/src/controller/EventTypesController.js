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

    async deleteEventTypes(req){
        const id = req.params.id
        await EventTypes.destroy({where: {id}})
    }

    async getAllEventTypes(req, res){
        const AllEventTypes = await EventTypes.findAll
        return res.json(AllEventTypes)
    }

    async getOneEventTypes(req, res){
        const id = req.params.id
        const OneEventTypes = await EventTypes.findByPk(id)
        return res.json(OneEventTypes)
    }
}

module.exports = new EventTypesController