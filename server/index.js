require('dotenv').config()
const express = require('express')
const router = require('./src/router/index')
const sequelize = require('./db')
require('./src/models/models');
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')
const eventRoutes = require('./src/router/EventRouter')



const PORT = process.env.PORT
const app = express()


app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

app.use(eventRoutes);
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