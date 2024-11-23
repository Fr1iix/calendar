const ApiError = require('../error/ApiError');
const {Disciplines} = require('../models/models')

class DisciplinesController{
    async create(req,res,next){
        try{
            let{name} = req.body
            const disciplines = await Disciplines.create({name});
            return res.json(disciplines)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteDisciplines(req){
        const id = req.params.id
        await Disciplines.destroy({where: {id}})
    }

    async getAllDisciplines(req, res){
        const AllDisciplines = await Disciplines.findAll
        return res.json(AllDisciplines)
    }

    async getOneDisciplines(req, res){
        const id = req.params.id
        const OneDisciplines = await Disciplines.findByPk(id)
        return res.json(OneDisciplines)
    }
}

module.exports = new DisciplinesController