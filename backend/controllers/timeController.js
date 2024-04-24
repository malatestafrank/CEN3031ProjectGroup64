const TimeLog = require('../models/timelogModel')
const mongoose = require('mongoose')

//get all Time Logs
const getTimeLogs = async (req, res) => {
    const logs = await TimeLog.find({})
    res.status(200).json(logs)
}

const getTimeLogID = async (req, res) => {
    const {projectTitle, selectedEmployee, selectedManager, timeIn, timeOut, dateIn, dateOut} = req.query
    const timelog = await TimeLog.findOne({projectTitle, selectedEmployee,
    selectedManager, timeIn, timeOut, dateIn, dateOut})
    if (!timelog){
        return res.status(404).json({error: 'Time Log ID Not Found'})
    }
    res.status(200).json(timelog._id)
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

const updateOriginalTimeLog = async (req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Time Log Not Found'})
    }
    const timelog = await TimeLog.findOneAndUpdate({_id:id}, {...req.body})
    if (!timelog){
        return res.status(400).json({error: "No such Time log"})

    }
    res.status(200).json(timelog)
}

const updateTimeLog = async (req, res) => {
    // in header
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Time Log Not Found'})
    }

    try {
        const new_data = {
            timeIn : req.body.editedTimeIn,
            timeOut : req.body.editedTimeOut,
            dateIn : req.body.editedDateIn,
            dateOut : req.body.editedDateOut
        }

        const timelog = await TimeLog.findOneAndUpdate({_id : id}, {...new_data})

        if (!timelog){
            return res.status(400).json({error: `No such Time log ${id}`})

        }
        res.status(200).json(timelog)
    }
    catch  {
        return res.status(400).json({error: "Error Has Occured"})
    }
    
}


module.exports = {
    getTimeLogs,
    getTimeLogID,
    getTimeLog,
    createTimeLog,
    deleteTimeLog,
    updateTimeLog,
    updateOriginalTimeLog
}