const fs = require('fs');
const pdfParse = require('pdf-parse');
const {Event, Gender, Address, Country, Region, City} = require("../models/models");
const ApiError = require("../error/ApiError");
const moment = require("moment");

// Чтение файла PDF
const pdfBuffer = fs.readFileSync('src/uploads/pdfFile.pdf');

class EventController{

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
                console.error('Ошибка чтения файла:', err);
                return;
            }

            try {
                const data = JSON.parse(jsonData); // Парсим JSON в объект

                for (const entry of data) {
                    const {
                        name,
                        dates,
                        location,
                        participants,
                        genderAge,
                        disciplineProgram
                    } = entry;

                    // Разделяем локацию на страну, регион и город
                    const locationMatch = location.match(/^(РОССИЯ)([^,]+),\s*(.+)$/);
                    const country = locationMatch ? locationMatch[1].trim() : null;
                    const region = locationMatch ? locationMatch[2].trim() : null;
                    const city = locationMatch ? locationMatch[3].trim() : null;

                    // Логируем разделенные значения
                    console.log(`Распарсенная локация - страна: ${country}, регион: ${region}, город: ${city}`);

                    // Если страна не найдена, выводим ошибку и продолжаем
                    if (!country || !region || !city) {
                        console.error('Ошибка: неверный формат локации. Пропущено одно или несколько значений.');
                        continue; // Пропускаем данный ивент, если локация некорректна
                    }

                    // Проверка длины строки города, если она больше 255 символов, обрезаем
                    const cityName = city.length > 255 ? city.substring(0, 255) : city;

                    // Разделяем genderAge на пол и возраст
                    const genderMatch = genderAge.match(/^(.*) от (\d+.*)$/);
                    const gender = genderMatch ? genderMatch[1].split(",").map(g => g.trim()) : [];
                    const age = genderMatch ? genderMatch[2].trim() : null;

                    // Логируем информацию о поле
                    console.log(`Пол участников: ${gender.join(', ')}, Возраст: ${age}`);

                    // Проверяем и обрабатываем дату
                    const startDate = moment(dates, 'DD.MM.YYYY', true);
                    if (!startDate.isValid()) {
                        console.error(`Ошибка: Некорректная дата "${dates}" для события "${name}"`);
                        continue; // Пропускаем данный ивент, если дата некорректна
                    }

                    // Находим или создаем записи для Gender, Country, Region и City
                    for (const g of gender) {
                        // Проверяем, что поле gender не пустое
                        if (!g) {
                            console.error('Ошибка: пустое значение для gender.');
                            continue;
                        }

                        const [gotGender] = await Gender.findOrCreate({
                            where: { gender: g },
                        });

                        const [gotCountry] = await Country.findOrCreate({
                            where: { country },
                        });

                        const [gotRegion] = await Region.findOrCreate({
                            where: { region },
                        });

                        const [gotCity] = await City.findOrCreate({
                            where: { city: cityName },
                        });

                        // Проверяем, что полученные объекты не пустые
                        if (!gotGender || !gotCountry || !gotRegion || !gotCity) {
                            console.error('Ошибка: не удалось создать необходимые записи в базе данных.');
                            continue;
                        }

                        // Создаем запись в таблице Event
                        const eventRecord = await Event.create({
                            name: name || '-',
                            startDate: startDate.toDate(),
                            endDate: null, // Поставьте дату окончания, если нужно
                            userCount: parseInt(participants, 10) || 0,
                            idGender: gotGender.idGender,
                            idAddress: gotCity.idCity, // Используем idCity для Address
                        });

                        console.log(`Ивент "${name}" успешно записан в базу данных!`);
                    }
                }
            } catch (error) {
                console.error('Ошибка при обработке данных:', error);
            }
        });
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