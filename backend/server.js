require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const projectRoutes = require('./routes/projectRoutes')
const userRoutes = require('./routes/user')
const timeRoutes = require('./routes/time')
const editedTimeRoutes = require('./routes/editedTime')

//express app
const app = express()

//middleware

app.use(express.json()) //required to send data to database

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/projects', projectRoutes)
app.use('/api/user', userRoutes)
app.use('/api/time', timeRoutes)
app.use('/api/editedtime', editedTimeRoutes)

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
