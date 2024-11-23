const ApiError = require('../error/ApiError');
const {Sports} = require('../models/models')

class SportsController{
    async create(req,res,next){
        try{
            let{name} = req.body
            const sports = await Sports.create({name});
            return res.json(sports)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteSports(req){
        const id = req.params.id
        await Sports.destroy({where: {id}})
    }

    async getAllSports(req, res){
        const AllSports = await Sports.findAll
        return res.json(AllSports)
    }

    async getOneSports(req, res){
        const id = req.params.id
        const OneSports = await Sports.findByPk(id)
        return res.json(OneSports)
    }
}

module.exports = new SportsController