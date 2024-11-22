const ApiError = require('../error/ApiError');
const {Event} = require('../models/models')

class EventController{
    async create(req,res,next){
        try{
            let{title, details, city, region, venue, participantsCount, gender, ageGroup, startDate, endDate, startTime, endTime, latitude, longitude, registrationLink, status} = req.body
            const event = await Event.create({title, details, city, region, venue, participantsCount, gender, ageGroup, startDate, endDate, startTime, endTime, latitude, longitude, registrationLink, status});
            return res.json(event)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteEvent(req,res){
        const id = req.params.id
        await Event.destroy({where: {id}})
    }

    async getAllEvent(req, res){
        const AllEvent = await Event.findAll
        return res.json(AllEvent)
    }

    async getOneEvent(req, res){
        const id = req.params.id
        const OneEvent = await Event.findByPk(id)
        return res.json(OneEvent)
    }
}

module.exports = new EventController()