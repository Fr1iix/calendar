const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { Event } = require('../models/models'); // Подключение модели для работы с таблицей

const extractEvents = (text) => {
    const eventRegex = /(\d{16})\n([А-ЯЁ\s]+)\n([а-яА-ЯёЁ,\s\d()]+)\n([А-ЯЁ,\s\w\d\-]+)\n(\d{2}\.\d{2}\.\d{4})\n(\d{2}\.\d{2}\.\d{4})\n([А-ЯЁ\s]+)\n([А-ЯЁ\s]+),\s*г\.\s*([\w\s\-]+)\n(\d+)/g;
    const results = [];

    let match;
    while ((match = eventRegex.exec(text)) !== null) {
        console.log("Совпадение найдено:", match);

        const [

            id,
            title,
            gender,
            sportDetails,
            startDate,
            endDate,
            country,
            region,
            city,
            participantsCount
        ] = match;

        const sportMatch = sportDetails.match(/([А-ЯЁ\s]+)\n/);
        const sport = sportMatch ? sportMatch[1].trim() : "Неизвестно";

        results.push({
            idEvent: id,
            sport: sport,
            competitionName: title.trim(),
            gender: gender.trim(),
            startDate: startDate.trim(),
            endDate: endDate.trim(),
            country: country.trim(),
            region: region.trim(),
            city: city.trim(),
            participantsCount: parseInt(participantsCount, 10),
        });
    }

    console.log(results)
    return results;
};

// Контроллер для парсинга PDF и сохранения результата в таблицу
const parsePdfFromFile = async (req, res) => {
    try {
        // Путь к PDF файлу, который нужно распарсить
        const filePath = path.join(__dirname, '../uploads', 'pdfFile.pdf'); // Замените на путь к вашему файлу

        // Читаем файл с сервера
        const pdfBuffer = fs.readFileSync(filePath);

        // Парсим PDF с помощью pdf-parse
        const parsedData = await pdfParse(pdfBuffer);

        // Извлечённый текст из PDF
        const text = parsedData.text;

        console.log(text)

        const formattedEvents = extractEvents(text);

        if (!formattedEvents) {
            return res.status(400).json({ message: 'PDF file is empty or cannot be parsed.' });
        }

        // Сохраняем текст в таблицу pdfParseResult
        const savedResult = await Event.create({text: formattedEvents});

        // Возвращаем подтверждение
        res.status(201).json({
            message: 'PDF parsed and saved successfully!',
            data: savedResult
        });
    } catch (error) {
        console.error('Error parsing PDF:', error);
        res.status(500).json({ message: 'An error occurred while parsing the PDF.', error });
    }
};

module.exports = { parsePdfFromFile };