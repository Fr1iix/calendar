const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { Events } = require('../models/models');

/**
 * Парсит строку из блока и возвращает объект для сохранения
 * @param {string} rawString - Исходная строка из PDF
 * @returns {Object} Данные для записи в базу
 */
const parseEventString = (rawString) => {
    // Разбиваем строку на строки, убирая лишние пробелы
    const lines = rawString.split('\n').map(line => line.trim()).filter(line => line);

    if (lines.length < 7) { // Проверяем, что в блоке достаточно строк
        throw new Error(`Invalid string format: Expected at least 7 lines, got ${lines.length}`);
    }

    const id = lines[0].match(/^\d{16}/)?.[0]; // ID (16 цифр в начале)
    if (!id) {
        throw new Error(`Invalid string format: Missing valid ID in block`);
    }

    const details = lines[0].slice(16).trim(); // Остальная часть строки после ID — название
    const gender = lines[1]; // Гендер
    const [startDate, endDate] = lines.slice(2, 4).map(date => new Date(date)); // Даты
    const country = lines[4]; // Страна

    // Регион и город могут быть разделены запятой
    const location = lines[5];
    const [region, city] = location.includes(',')
        ? location.split(',').map(part => part.trim())
        : [location.trim(), null];

    // Количество участников (последняя строка)
    const participants = parseInt(lines[6], 10);

    return {
        id,
        title: details,
        gender,
        startDate,
        endDate,
        country,
        region,
        city,
        participantsCount: participants,
    };
};

/**
 * Контроллер для парсинга PDF и записи данных в базу
 * @param {Object} req - Объект запроса
 * @param {Object} res - Объект ответа
 */
const parsePdfAndSaveEvents = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../uploads', 'pdfFile.pdf');
        const pdfBuffer = fs.readFileSync(filePath);

        const parsedData = await pdfParse(pdfBuffer);

        const text = parsedData.text;
        const blocks = text.split(/(?=\d{16})/).filter(block => block.trim());
        console.log('Extracted Blocks:', blocks); // Лог для проверки


        const events = [];
        for (const block of blocks) {
            try {
                console.log('начало блока')
                console.log('Processing block:', block);
                console.log('конец блока')
                console.log('-----------------------------------------------')

                if (!block || typeof block !== 'string') {
                    console.warn('Skipping invalid block:', block);
                    continue;
                }

                const eventData = parseEventString(block);
                console.log('Parsed event:', eventData);

                events.push(eventData);
            } catch (err) {
                console.warn(`Failed to parse block: {block}`, err.message);
            }
        }

        if (events.length === 0) {
            return res.status(400).json({ error: 'No valid events found in the PDF' });
        }

        const savedEvents = await Events.bulkCreate(events);
        res.json({
            message: 'Events parsed and saved successfully',
            savedEvents,
        });
    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ error: 'Failed to process PDF', details: error.message });
    }
};

module.exports = { parsePdfAndSaveEvents };
