require('dotenv').config()
const express = require('express')
const router = require('./src/router/index')
const sequelize = require('./db')
require('./src/models/models');
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')
const eventRouter = require('./src/router/EventRouter')
const sportRouter = require('./src/router/SportsRouter');

const PORT = process.env.PORT
const app = express()

// Настройка CORS с более строгими параметрами
app.use(cors({
    origin: ['http://localhost:3000', 'https://yourdomain.com'], // Разрешенные домены
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Разрешенные методы
    allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
    credentials: true // Разрешить передачу куки и авторизационных заголовков
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')))
app.use(fileUpload({}))

// Центральный обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Что-то пошло не так',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

app.use('/api', router)
app.use('/api/events', eventRouter);
app.use('/api/sports', sportRouter);

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`)
        })
    } catch (e) {
        console.error('Ошибка запуска сервера:', e)
    }
}

start()