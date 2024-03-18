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

const router = express.Router()

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