const mongoose = require('mongoose')

const Schema = mongoose.Schema

/*
    Project contains:
        title
        description
        array of employee emails
        array of manager emails
*/

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 88 //arbitrary should be between 50-100 chars for a title
    },
    description: {
        type: String,
        maxlength: 500, //depends on how complex we want the description to be
        required: true
    },
    employees: {
        type: [String],
        required: false
    },
    managers: {
        type: [String],
        required: false
    }
})


module.exports = mongoose.model('Project', projectSchema)