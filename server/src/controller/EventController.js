const fs = require('fs');
const pdfParse = require('pdf-parse');
const {Event, Gender, Address, Country, Region, City} = require("../models/models");
const ApiError = require("../error/ApiError");
const {parseDataURI} = require("nodemailer/lib/shared");
const moment = require("moment");

// Чтение файла PDF
const pdfBuffer = fs.readFileSync('src/uploads/pdfFile.pdf');

class EventController{
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

    async parse(req, res, next){
        pdfParse(pdfBuffer).then(data => {
            const text = data.text;

            // Разбиваем текст на строки
            const lines = text.split('\n');

            // Массив для хранения результатов
            const events = [];
            let currentEvent = {};
            let collecting = false;

            lines.forEach((line) => {
                line = line.trim();

                // Проверяем начало новой записи
                if (line.match(/ЧЕМПИОНАТ|ВСЕРОССИЙСКИЕ|ПЕРВЕНСТВО|КУБОК/)) {
                    if (Object.keys(currentEvent).length > 0) {
                        // Удаляем цифры в начале поля name
                        currentEvent.name = currentEvent.name.replace(/^\d+/, '').trim();

                        events.push({
                            ...currentEvent,
                            name: currentEvent.name.trim(),
                            dates: currentEvent.dates.trim(),
                            location: currentEvent.location.trim(),
                            genderAge: currentEvent.genderAge.trim(),
                            disciplineProgram: currentEvent.disciplineProgram.trim(),
                        });
                    }

                    // Создаем новую запись
                    currentEvent = {
                        name: line, // Название начинается с текущей строки
                        dates: '',
                        location: '',
                        participants: '',
                        genderAge: '',
                        disciplineProgram: '',
                    };
                    collecting = true;
                } else if (collecting) {
                    if (line.match(/женщины|мужчины|юниоры|юниорки/)) {
                        currentEvent.genderAge = line;
                    } else if (line.match(/КЛАСС|дисциплина/)) {
                        currentEvent.disciplineProgram = line.replace('КЛАСС', '').trim();
                    } else if (line.match(/\d{2}\.\d{2}\.\d{4}/)) {
                        // Обрабатываем несколько дат
                        currentEvent.dates += `${line} `;
                    } else if (line.match(/РОССИЯ|МОСКОВСКАЯ ОБЛАСТЬ|РЕСПУБЛИКА БАШКОРТОСТАН|г\.|область|край/)) {
                        // Обрабатываем несколько локаций
                        currentEvent.location += `${line} `;
                    } else if (line.match(/^\d+$/)) {
                        currentEvent.participants = line;
                    }
                }
            });

            // Добавляем последнюю запись
            if (Object.keys(currentEvent).length > 0) {
                // Удаляем цифры в начале поля name
                currentEvent.name = currentEvent.name.replace(/^\d+/, '').trim();

                events.push({
                    ...currentEvent,
                    name: currentEvent.name.trim(),
                    dates: currentEvent.dates.trim(),
                    location: currentEvent.location.trim(),
                    genderAge: currentEvent.genderAge.trim(),
                    disciplineProgram: currentEvent.disciplineProgram.trim(),
                });
            }

            // Разбиваем множественные локации и даты на отдельные события
            const finalEvents = [];
            events.forEach(event => {
                const dates = event.dates.split(' ').filter(Boolean);
                const locations = event.location.split('РЕСПУБЛИКА БАШКОРТОСТАН|РОССИЯ').filter(Boolean); // Разделяем локации по признакам

                dates.forEach((date, i) => {
                    finalEvents.push({
                        ...event,
                        dates: date,
                        location: locations[i] || event.location, // Присваиваем соответствующую локацию
                    });
                });
            });

            // Убираем дубликаты
            const uniqueEvents = finalEvents.filter(
                (event, index, self) =>
                    index === self.findIndex(e => e.name === event.name && e.dates === event.dates)
            );

            // Сохраняем результат в JSON
            fs.writeFileSync('events.json', JSON.stringify(uniqueEvents, null, 2), 'utf8');
            console.log('Данные сохранены в файл events.json');
        }).catch(err => {
            next('Ошибка при чтении PDF:', err);
        });
    }

    async create(req, res, next){


            try {

                const {name, startDate, endDate, userCount, gender, country, region, city} = req.body;
                const Adres = [];

                const SDate = moment(startDate, 'DD/MM/YYYY').toDate();
                const EDate = moment(endDate, 'DD/MM/YYYY').toDate();

                const getGender = await Gender.findOne({
                    where: {
                        gender: gender
                }}
                )



                // Создаём или получаем страну
                Adres.push(await Country.findOrCreate({
                    where: {country},
                }));

                // Создаём или получаем регион
                Adres.push(await Region.findOrCreate({
                    where: {region},
                }));

                // Создаём или получаем город
                Adres.push(await City.findOrCreate({
                    where: {city},
                }));


                // Создаём или проверяем запись в таблице Address
                const [gotAddress] = await Address.findOrCreate({
                    where: {
                        idCountry: Adres[0]?.idCountry || null, // Используем идентификатор страны, если есть
                        idRegion: Adres[1]?.idRegion || null,   // Используем идентификатор региона, если есть
                        idCity: Adres[2]?.idCity || null,         // Используем идентификатор города, если есть
                    },
                });

                const [gotEvents] = await Event.findOrCreate({
                    where: {
                        name: name || ' ',
                        startDate: SDate || Date.now(),
                        endDate: EDate || null,
                        userCount: userCount || null,
                        idGender: getGender.idGender || null,
                        idAddress: gotAddress?.idAddress || null,
                    }
                })

                return res.json(gotEvents)
            } catch (e) {
                next(ApiError.badRequest(e.message))
            }

    }

    async createFromJson(req,res){
        fs.readFile('events.json', 'utf8', async (err, jsonData) => {
            if (err) {
                console.error("Ошибка чтения файла:", err);
                return;
            }
            try {
                // Парсим JSON-строку в объект
                const data = JSON.parse(jsonData);

                // Преобразуем данные
                const transformedData = this.transformData(data);
                const data1 = transformedData.map(entry => entry.country);
                const data2 = transformedData.map(entry => entry.region);
                const data3 = transformedData.map(entry => entry.city);

                try{

                    for (const country of data1) {
                        try {
                            // Создаём запись или пропускаем, если уже существует
                            await Country.findOrCreate({
                                where: { country }, // Проверяем уникальность по полю gender
                            });
                        } catch (err) {
                            console.error("Ошибка вставки данных:", err);
                        }

                    }

                    for (const region of data2) {
                        try {
                            // Создаём запись или пропускаем, если уже существует
                            await Region.findOrCreate({
                                where: { region }, // Проверяем уникальность по полю gender
                            });
                        } catch (err) {
                            console.error("Ошибка вставки данных:", err);
                        }

                    }

                    for (const city of data3) {
                        try {
                            // Создаём запись или пропускаем, если уже существует
                            await City.findOrCreate({
                                where: { city }, // Проверяем уникальность по полю gender
                            });
                        } catch (err) {
                            console.error("Ошибка вставки данных:", err);
                        }

                    }


                    console.log("Данные успешно записаны в базу данных!");
                } catch (err) {
                    console.error("Ошибка работы с базой данных:", err);
                }

                res.json(data1, data2, data3);

            } catch (parseErr) {
                console.error("Ошибка парсинга JSON:", parseErr);
            }
        })
    }

    async deleteEvent(req){
        const idGender = req.params.id
        await Gender.destroy({where: {idGender}})
    }

    async getAllEvents(req, res){
        const AllGender = await Gender.findAll();
        return res.json(AllGender)
    }

    async getOneEvent(req, res){
        const idGender = req.params.id
        const OneGender = await Gender.findByPk(idGender)
        return res.json(OneGender)
    }
}


module.exports = new EventController();