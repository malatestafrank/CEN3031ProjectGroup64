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
    dateIn:{
        type: Date,
        required: true
    },
    dateOut:{
        type: Date,
        required: true
    },
})


module.exports = mongoose.model('Timelog', timelogSchema)
