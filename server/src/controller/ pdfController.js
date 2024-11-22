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
    const matches = rawString.match(/\((.*?)\)/g);

    if (!matches || matches.length < 4) {
        throw new Error('Invalid string format');
    }

    const [id, details, dates, location, participants] = matches.map(match => match.slice(1, -1));

    const genderMatch = details.match(/женщины|мужчины|Mixed/gi);
    const gender = genderMatch ? genderMatch.join(', ') : null;

    const ageGroupMatch = details.match(/\d+\s*лет\s*и\s*старше/gi);
    const ageGroup = ageGroupMatch ? ageGroupMatch[0] : null;

    const [startDate, endDate] = dates.split(/\s+/).map(date => new Date(date.trim()));

    const [country, regionAndCity] = location.split(/\n/);
    const [region, city] = regionAndCity.split(/,\s+/);

    return {
        title: details.split('\n')[0],
        details,
        city: city ? city.trim() : null,
        region: region ? region.trim() : null,
        participantsCount: parseInt(participants, 10),
        gender,
        ageGroup,
        startDate,
        endDate,
        country: country.trim(),
    };
};

/**
 * Контроллер для парсинга PDF и записи данных в базу
 * @param {Object} req - Объект запроса
 * @param {Object} res - Объект ответа
 */
const parsePdfAndSaveEvents = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../uploads', 'pdfFile.pdf'); // Путь к PDF
        const pdfBuffer = fs.readFileSync(filePath);

        // Парсинг PDF
        const parsedData = await pdfParse(pdfBuffer);
        const text = parsedData.text;

        // Разделение текста на блоки
        const blocks = text.split('\n\n').filter(block => block.trim());

        const events = [];
        for (const block of blocks) {
            try {
                const eventData = parseEventString(block);
                events.push(eventData);
            } catch (err) {
                console.warn(`Failed to parse block: ${block}`, err.message);
            }
        }

        console.log('Parsed Events:', events); // Лог для проверки

        if (events.length === 0) {
            return res.status(400).json({ error: 'No valid events found in the PDF' });
        }

        // Сохранение в базу данных
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
