const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { pdfParseResult } = require('../models/models'); // Подключение модели для работы с таблицей

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

        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'PDF file is empty or cannot be parsed.' });
        }

        // Сохраняем текст в таблицу pdfParseResult
        const savedResult = await pdfParseResult.create({ text });

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