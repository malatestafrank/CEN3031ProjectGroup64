const express = require('express')

//controller functions
const {getTimeLogs, getTimeLog, createTimeLog, deleteTimeLog} = require('../controllers/timeController')

const router = express.Router()


router.get('/', getTimeLogs)

//GET a single object
router.get('/:id', getTimeLog)

router.post('/', createTimeLog)

router.delete('/:id', deleteTimeLog)

module.exports = router