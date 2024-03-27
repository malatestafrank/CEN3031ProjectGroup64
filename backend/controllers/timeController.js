const TimeLog = require('../models/timelogModel')
const mongoose = require('mongoose')

//get all Time Logs
const getTimeLogs = async (req, res) => {
    const logs = await TimeLog.find({})
    res.status(200).json(logs)
}

//create new Time Log
const createTimeLog = async (req, res) => {
    const {projectTitle, timeIn, timeOut, dateIn, dateOut} = req.body

    //add doc to db
    try {
        const log = await TimeLog.create({projectTitle, timeIn, timeOut, dateIn, dateOut})
        res.status(200).json(log)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    getTimeLogs,
    createTimeLog
}