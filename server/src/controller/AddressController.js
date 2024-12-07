const ApiError = require('../error/ApiError');
const {Address, Country, Region, City, Gender} = require('../models/models')
const fs = require('fs');

class AddressController {
    async create(req,res,next){
        try{
            const { country, region, city } = req.body;

            // ДОДЕЛАТЬ НЕ ДО КОНЦА СДЕЛАНО!!!!

            // Создаём или получаем страну
            const [gotCountry] = await Country.findOrCreate({
                where: { country },
            });

            // Создаём или получаем регион
            const [gotRegion] = await Region.findOrCreate({
                where: { region },
            });

            // Создаём или получаем город
            const [gotCity] = await City.findOrCreate({
                where: { city },
            });

            // Создаём или проверяем запись в таблице Address
            const [gotAddress] = await Address.findOrCreate({
                where: {
                    idCountry: gotCountry.idCountry, // Используем идентификатор страны
                    idRegion: gotRegion.idRegion,   // Используем идентификатор региона
                    idCity: gotCity.idCity,       // Используем идентификатор города
                },
            });
            return res.json(gotAddress)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteAddress(req){
        const idAddress = req.params.id
        await Address.destroy({where: {idAddress}})
    }

    async getAllAddresses(req, res){
        const AllAddresses = await Address.findAll();
        return res.json(AllAddresses)
    }

    async getOneAddress(req, res){
        const idAddress = req.params.id
        const oneAddress = await Address.findByPk(idAddress)
        return res.json(oneAddress)
    }
}

module.exports = new AddressController();