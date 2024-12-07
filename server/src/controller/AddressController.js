const ApiError = require('../error/ApiError');
const {Address, Country, Region, City, Gender} = require('../models/models')
const fs = require('fs');

class AddressController {
    async create(req,res,next){
        try{
            const { country, region, city } = req.body;

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
    };

    createFromJson(req, res, next) {
        fs.readFile('events.json', 'utf8', async (err, jsonData) => {
            if (err) {
                console.error('Ошибка чтения файла:', err);
                return;
            }
            try {
                const data = JSON.parse(jsonData); // Парсим JSON в объект

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

                const transformedData = transformData(data);

                try {
                    const results = []; // Для хранения созданных адресов
                    for (const event of transformedData) {
                        const country = event.country;
                        const region = event.region;
                        const city = event.city ? event.city.slice(0, 255) : null; // Ограничение длины строки

                        const [gotCountry] = country
                            ? await Country.findOrCreate({ where: { country } })
                            : [null];
                        const [gotRegion] = region
                            ? await Region.findOrCreate({ where: { region } })
                            : [null];
                        const [gotCity] = city
                            ? await City.findOrCreate({ where: { city } })
                            : [null];

                       await Address.findOrCreate({
                            where: {
                                idCountry: gotCountry?.idCountry || null,
                                idRegion: gotRegion?.idRegion || null,
                                idCity: gotCity?.idCity || null,
                            },
                        });

                    }

                    res.status(201)// Возвращаем все созданные адреса
                } catch (error) {
                    console.error("Ошибка работы с базой данных:", error);
                    next(error); // Передаём ошибку в middleware
                }
            } catch (error) {
                console.error("Ошибка при обработке данных:", error);
                next(error); // Передаём ошибку в middleware
            }
        });

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