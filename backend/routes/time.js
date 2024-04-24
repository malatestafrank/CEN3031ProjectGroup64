const express = require('express')

//controller functions
const {getTimeLogs, getTimeLogID, getTimeLog, createTimeLog, deleteTimeLog, updateTimeLog, updateOriginalTimeLog} = require('../controllers/timeController')

const router = express.Router()


router.get('/', getTimeLogs)

router.get('/id', getTimeLogID)

//GET a single object
router.get('/:id', getTimeLog)

router.post('/', createTimeLog)

router.delete('/:id', deleteTimeLog)

router.patch('/:id', updateTimeLog)

router.patch('/original/:id', updateOriginalTimeLog)

module.exports = router