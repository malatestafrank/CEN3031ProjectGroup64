/*
    Handles API requests and responses for projects
*/

const express = require('express')
const {
    createProject,
    getProjects,
    getProject,
    deleteProject,
    updateProject
} = require('../controllers/projectController')

const { requireAUTH, requireAUTHManager } = require('../middleware/requireAuth')

//require auth for all project routes
const router = express.Router()

router.use(requireAUTH)

//GET all objects
router.get('/', getProjects)

//GET a single object
router.get('/:id', getProject)

//POST a new project
router.post('/', createProject)

//DELETE an object
router.delete('/:id', deleteProject)

//UPDATE an object
router.patch('/:id', updateProject)

module.exports = router