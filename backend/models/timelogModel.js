const mongoose = require('mongoose')

const Schema = mongoose.Schema

const timelogSchema = new Schema({
    projectTitle: {
        type: String,
        required: true
    },
    timeIn: {
        type: String,
        required: true
    },
    timeOut:{
        type: String,
        required: true
    },
    dateIn: {
        type: String,
        required: true
    },
    dateOut:{
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Timelog', timelogSchema)
