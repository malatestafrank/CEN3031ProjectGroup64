require('dotenv').config()

const express = require('express')
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

//listen for requests
app.listen(process.env.PORT, () => {
    console.log('listening on port', process.env.PORT)
})