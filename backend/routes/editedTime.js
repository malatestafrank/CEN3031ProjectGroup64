const express = require('express')

//controller functions
const {getEditedTimeLogs, createEditedTimeLog} = require('../controllers/editedTimeLogController')

const router = express.Router()

router.get('/', getEditedTimeLogs)

router.post('/', createEditedTimeLog)

module.exports = router