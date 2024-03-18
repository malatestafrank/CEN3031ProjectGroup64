const mongoose = require('mongoose')

const Schema = mongoose.Schema

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
        type: [{
            employeeId: {
                //type: [mongoose.Schema.Types.ObjectId]
                type: Number
            },
            /*timeEntries: {
                type: [timeEntrySchema],
                default: []
            }*/
        }],
        required: false
    },
    managers: {
        type: [{
            managerId: {
                //type: [mongoose.Schema.Types.ObjectId]
                type: Number
            },
            /*timeEntries: {
                type: [timeEntrySchema],
                default: []
            }*/
        }],
        required: false
    },
    admins: {
        //type: [mongoose.Schema.Types.ObjectId],
        type: Number,
        required: true
    }
})

//may need to make this its own model file
const timeEntrySchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: false 
    },
    //if we want to have a description for each time log (essentially a report)
    description: {
        type: String,
        minlength: 3,
        maxlength: 500,
        required: false
    }
})

module.exports = mongoose.model('Project', projectSchema)