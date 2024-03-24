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
const requireAuth = require("../middleware/requireAuth")

const router = express.Router()
// require auth for all project routes

router.use(requireAuth)

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