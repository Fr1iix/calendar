const ApiError = require('../error/ApiError');
const {Event,Address, Country, Region, City} = require('../models/models');
const fs = require('fs');


class AddressController {
    transformData(data) {
        return data.map(entry => {
            // Разделяем location на страну, регион и город
            const locationMatch = entry.location.match(/^(РОССИЯ)([^,]+),\s*(.+)$/);
            const country = locationMatch ? locationMatch[1].trim() : null;
            const region = locationMatch ? locationMatch[2].trim() : null;
            const city = locationMatch ? locationMatch[3].trim() : null;
            // Разделяем genderAge на пол и возраст
            const genderMatch = entry.genderAge.match(/^(.*) от (\d+.*)$/);
            const gender = genderMatch ? genderMatch[1].split(",").map(g => g.trim()) : [];
            const age = genderMatch ? genderMatch[2].trim() : null;

            return {
                name: entry.name,
                dates: entry.dates,
                country,
                region,
                city,
                participants: parseInt(entry.participants, 10),
                gender,
                age,
                disciplineProgram: entry.disciplineProgram
            };
        });
    }

    async create(req,res,next){
        try{
            const {country, region, city } = req.body;

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
                    idCountry: gotCountry?.idCountry || null, // Используем идентификатор страны, если есть
                    idRegion: gotRegion?.idRegion || null,   // Используем идентификатор региона, если есть
                    idCity: gotCity?.idCity || null,         // Используем идентификатор города, если есть
                },
            });
            return res.json(gotAddress)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    // async createFromJson(req,res){
    //     fs.readFile('events.json', 'utf8', async (err, jsonData) => {
    //         if (err) {
    //             console.error("Ошибка чтения файла:", err);
    //             return;
    //         }
    //         try {
    //             // Парсим JSON-строку в объект
    //             const data = JSON.parse(jsonData);
    //
    //             // Преобразуем данные
    //             const transformedData = this.transformData(data);
    //             const data1 = transformedData.map(entry => entry.country);
    //             const data2 = transformedData.map(entry => entry.region);
    //             const data3 = transformedData.map(entry => entry.city);
    //
    //             try{
    //
    //                 for (const country of data1) {
    //                     try {
    //                         // Создаём запись или пропускаем, если уже существует
    //                         await Country.findOrCreate({
    //                             where: { country }, // Проверяем уникальность по полю gender
    //                         });
    //                     } catch (err) {
    //                         console.error("Ошибка вставки данных:", err);
    //                     }
    //
    //                 }
    //
    //                 for (const region of data2) {
    //                     try {
    //                         // Создаём запись или пропускаем, если уже существует
    //                         await Region.findOrCreate({
    //                             where: { region }, // Проверяем уникальность по полю gender
    //                         });
    //                     } catch (err) {
    //                         console.error("Ошибка вставки данных:", err);
    //                     }
    //
    //                 }
    //
    //                 for (const city of data3) {
    //                     try {
    //                         // Создаём запись или пропускаем, если уже существует
    //                         await City.findOrCreate({
    //                             where: { city }, // Проверяем уникальность по полю gender
    //                         });
    //                     } catch (err) {
    //                         console.error("Ошибка вставки данных:", err);
    //                     }
    //
    //                 }
    //
    //
    //                 console.log("Данные успешно записаны в базу данных!");
    //             } catch (err) {
    //                 console.error("Ошибка работы с базой данных:", err);
    //             }
    //
    //             res.json(data1, data2, data3);
    //
    //         } catch (parseErr) {
    //             console.error("Ошибка парсинга JSON:", parseErr);
    //         }
    //     })
    // }

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