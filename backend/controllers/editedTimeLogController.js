const EditedTimeLog = require('../models/editedTimeLogModel')
const mongoose = require('mongoose')

const getEditedTimeLogs = async (req, res) => {
    const editedLogs = await EditedTimeLog.find({})
    res.status(200).json(editedLogs)
}

//create new Edited Time Log
const createEditedTimeLog = async (req, res) => {
    const {timeLogID, editedTimeIn, editedTimeOut, editedDateIn, editedDateOut} = req.body

    //add doc to db
    try {
        const editedlog = await EditedTimeLog.create({timeLogID, editedTimeIn, editedTimeOut, editedDateIn, editedDateOut})
        res.status(200).json(editedlog)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
//remove edited time log
const deleteTimeLog = async (req, res) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Edited time Log Not Found'})
    }
    const timelog = await EditedTimeLog.findOneAndDelete({_id: id})
    if(!timelog) {
        return res.status(400).json({error: 'Edited time Log Not Found'})
    }
    res.status(200).json(timelog)
}


module.exports = {
    getEditedTimeLogs,
    createEditedTimeLog,
    deleteTimeLog
}