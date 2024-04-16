const mongoose = require('mongoose')

const Schema = mongoose.Schema

const timelogSchema = new Schema({
    projectTitle: {
        type: String,
        required: true
    },
    selectedEmployee: {
        type: String,
        required: true,
        default : ""
    },
    selectedManager: {
        type: String,
        required: true,
        default : ""
    },
    timeIn: {
        type: String,
        required: true
    },
    timeOut:{
        type: String,
        required: false,
        default: "Not Clocked Out"
    },
    dateIn: {
        type: String,
        required: true
    },
    dateOut:{
        type: String,
        required: false,
        default: "Not Clocked Out"
    }
})


module.exports = mongoose.model('Timelog', timelogSchema)
