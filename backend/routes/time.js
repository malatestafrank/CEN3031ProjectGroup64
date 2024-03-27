const express = require('express')

//controller functions
const {getTimeLogs, createTimeLog} = require('../controllers/timeController')

const router = express.Router()

router.get('/', getTimeLogs)

router.post('/', createTimeLog)

module.exports = router