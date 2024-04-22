const mongoose = require('mongoose')

const Schema = mongoose.Schema

const editedTimeLogSchema = new Schema({
    timeLogID: {
        type: String,
        required: true
    },
    editedTimeIn: {
        type: String,
        required: false
    },
    editedTimeOut:{
        type: String,
        required: false
    },
    editedDateIn: {
        type: String,
        required: false
    },
    editedDateOut:{
        type: String,
        required: false,
    }
})


module.exports = mongoose.model('EditedTimeLog', editedTimeLogSchema)
