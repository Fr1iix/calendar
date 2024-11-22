const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Функция для парсинга PDF из файла на сервере
const parsePdfFromFile = (req, res) => {
    const filePath = path.join(__dirname, '../uploads', 'example.pdf'); // Путь к вашему файлу

    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading the file.');
        }

        pdfParse(data).then(parsedData => {
            // Возвращаем текст из PDF
            res.json({ text: parsedData.text });
        }).catch(err => {
            res.status(500).send('Error parsing PDF.');
        });
    });
};

module.exports = { parsePdfFromFile };