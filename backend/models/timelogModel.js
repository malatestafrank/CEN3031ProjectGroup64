const mongoose = require('mongoose')

const Schema = mongoose.Schema

const timelogSchema = new Schema({
    projectTitle: {
        type: String,
        required: true
    },
    selectedEmployee: {
        type: String,
        required: false,
        default : "Not an Employee Position"
    },
    selectedManager: {
        type: String,
        required: false,
        default : "Not a Manager Position"
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
