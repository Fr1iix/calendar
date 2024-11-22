const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

/**
 * Парсит строку из блока и возвращает объект с данными события
 * @param {string} rawString - Исходная строка из PDF
 * @returns {Object} Данные события
 */
const parseEventString = (rawString) => {
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
 * Middleware для парсинга PDF и передачи списка событий в следующий обработчик
 * @param {Object} req - Объект запроса
 * @param {Object} res - Объект ответа
 * @param {Function} next - Следующий обработчик
 */
const parsePdfMiddleware = async (req, res, next) => {
    try {
        const filePath = path.join(__dirname, '../uploads', 'pdfFile.pdf'); // Путь к PDF
        const pdfBuffer = fs.readFileSync(filePath);

        // Парсинг PDF
        const parsedData = await pdfParse(pdfBuffer);
        const text = parsedData.text;

        // Разделение текста на блоки по ID (16 цифр в начале строки)
        const blocks = text.split(/(?=\d{16})/).filter(block => block.trim());

        const events = [];
        for (const block of blocks) {
            try {
                const eventData = parseEventString(block);
                events.push(eventData);
            } catch (err) {
                console.warn(`Failed to parse block: ${block}`, err.message);
            }
        }

        if (events.length === 0) {
            return res.status(400).json({ error: 'No valid events found in the PDF' });
        }

        console.log(events)

        // Передаем список событий в req.body.events
        req.body.events = events;
        next(); // Передаем управление следующему обработчику
    } catch (error) {
        console.error('Error processing PDF:', error.message);
        res.status(500).json({ error: 'Failed to process PDF', details: error.message });
    }
};

module.exports = parsePdfMiddleware;
