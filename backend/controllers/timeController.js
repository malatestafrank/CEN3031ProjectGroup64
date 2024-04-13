const TimeLog = require('../models/timelogModel')
const mongoose = require('mongoose')

//get all Time Logs
const getTimeLogs = async (req, res) => {
    const logs = await TimeLog.find({})
    res.status(200).json(logs)
}

const getTimeLog = async (req, res) => {
    const{id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Time Log Not Found'})
    }

    const timelog = await TimeLog.findById(id)

    if(!timelog) {
        return res.status(404).json({error: 'Time Log Not Found'})
    }

    res.status(200).json(timelog)
}

//create new Time Log
const createTimeLog = async (req, res) => {
    const {projectTitle, selectedEmployee, selectedManager, timeIn, timeOut, dateIn, dateOut} = req.body

    //add doc to db
    try {
        const log = await TimeLog.create({projectTitle, selectedEmployee, selectedManager, timeIn, timeOut, dateIn, dateOut})
        res.status(200).json(log)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const deleteTimeLog = async (req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Time Log Not Found'})
    }
    const timelog = await TimeLog.findOneAndDelete({_id: id})
    if(!timelog) {
        return res.status(400).json({error: 'Time Log Not Found'})
    }
    res.status(200).json(timelog)
}


module.exports = {
    getTimeLogs,
    getTimeLog,
    createTimeLog,
    deleteTimeLog
}