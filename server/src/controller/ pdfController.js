const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Функция для парсинга PDF
const parsePdf = (req, res) => {
    const file = req.files.pdfFile;  // Получаем файл из запроса

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = path.join(__dirname, '../uploads', file.name);

    // Сохраняем файл на сервере
    fs.writeFileSync(filePath, file.data);

    // Парсим PDF файл
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file.');
        }

        pdfParse(data).then(parsedData => {
            // Отправляем извлеченный текст как ответ
            res.json({ text: parsedData.text });
        }).catch(err => {
            res.status(500).send('Error parsing PDF.');
        });
    });
};

module.exports = { parsePdf };
