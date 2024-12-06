const fs = require('fs');
const pdfParse = require('pdf-parse');

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
                        currentEvent.dates += `${line}`;
                    } else if (line.match(/РОССИЯ|МОСКОВСКАЯ ОБЛАСТЬ|РЕСПУБЛИКА БАШКОРТОСТАН|г\.|область|край/)) {
                        // Обрабатываем несколько локаций
                        currentEvent.location += `${line}`;
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
            console.log('Данные сохранены в файл events.json');
            return fs.writeFileSync('events.json', JSON.stringify(uniqueEvents, null, 2), 'utf8');

        }).catch(err => {
            console.error('Ошибка при чтении PDF:', err);
        });
    }
}


