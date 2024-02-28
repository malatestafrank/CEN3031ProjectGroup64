require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const objectRoutes = require('./routes/objects')

//express app
const app = express()

//middleware

app.use(express.json()) //required to send data to database

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/objects', objectRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })
