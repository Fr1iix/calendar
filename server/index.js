require('dotenv').config()
const express = require('express')
const router = require('./src/router/index')
const sequelize = require('./db')
require('./src/models/models');
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')
const pdfRoutes = require('./src/router/pdfRoutes');


const PORT = process.env.PORT
const app = express()


app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
// Настройка для обработки загрузки файлов
app.use(fileUpload());

// Статические файлы для загрузки (например, для изображения или документов)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(pdfRoutes);

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()