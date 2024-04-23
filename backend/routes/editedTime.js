const express = require('express')

//controller functions
const { getEditedTimeLogs, createEditedTimeLog, deleteTimeLog } = require('../controllers/editedTimeLogController')

const { requireAUTH, requireAUTHManager } = require('../middleware/requireAuth')

//require auth for all project routes
const router = express.Router()

router.use(requireAUTHManager)

router.get('/', getEditedTimeLogs)

router.post('/', createEditedTimeLog)

router.delete('/:id', deleteTimeLog)

module.exports = router