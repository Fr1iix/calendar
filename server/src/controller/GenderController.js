const ApiError = require('../error/ApiError');
const {Gender} = require('../models/models')
const fs = require('fs');



class GenderController{
    async create(req,res,next){
        try{
            let{gender} = req.body
            const gender1 = await Gender.create({gender});
            return res.json(gender1)
        }catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createFromJson(req,res,next){
        fs.readFile('events.json', 'utf8', async (err, jsonData) => {
            if (err) {
                console.error("Ошибка чтения файла:", err);
                return;
            }
            try {
                // Парсим JSON-строку в объект
                const data = JSON.parse(jsonData);

                // Функция для преобразования данных
                function transformData(data) {
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

                // Преобразуем данные
                const transformedData = transformData(data);
                const data1 = transformedData.map(entry => entry.gender);
            try{
                for (const arr of data1) {
                    for (const gender of arr){
                        try {
                            // Создаём запись или пропускаем, если уже существует
                            await Gender.findOrCreate({
                                where: { gender }, // Проверяем уникальность по полю gender
                            });
                        } catch (err) {
                            console.error("Ошибка вставки данных:", err);
                        }
                    }

                }

                console.log("Данные успешно записаны в базу данных!");
            } catch (err) {
                next("Ошибка работы с базой данных:", err);
            }

                res.json(data1);

            } catch (parseErr) {
                next("Ошибка парсинга JSON:", parseErr);
            }
        });
    }


    async deleteGender(req){
        const idGender = req.params.id
        await Gender.destroy({where: {idGender}})
    }

    async getAllSports(req, res){
        const AllGender = await Gender.findAll();
        return res.json(AllGender)
    }

    async getOneSports(req, res){
        const idGender = req.params.id
        const OneGender = await Gender.findByPk(idGender)
        return res.json(OneGender)
    }
}

module.exports = new GenderController