const ApiError = require('../error/ApiError');
const {News, Event} = require('../models/models')

class NewsController{
    async create(req,res,next){
        try{
            const {title, descriprion, img, idEvent} = req.body

            const event = await Event.findByPk(idEvent)

            if(!event){
                next()
            }

            const news = await News.create({
                where: {
                    title: title,
                    description: descriprion || null,
                    img: img,
                    idEvent: idEvent,
                }
            });
            return res.json(news)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteNews(req){
        const id = req.params.id
        await News.destroy({where: {id}})
    }

    async getAllNews(req, res){
        const AllNews = await News.findAll
        return res.json(AllNews)
    }

    async getOneNews(req, res){
        const id = req.params.id
        const OneNews = await News.findByPk(id)
        return res.json(OneNews)
    }
}

module.exports = new NewsController();