/*
    Handles API requests and responses for projects
*/

const express = require('express')
//const Project = require('..models/projectModel')

const router = express.Router()

//GET all objects
router.get('/', (req, res) => {
    res.json({mssg: 'GET all objects'})
})

//GET a single object
router.get('/:id', (req, res) => {
    res.json({mssg: 'GET a single object'})
})

//POST a new object
router.post('/', async (req, res) => {
    const {title, description, employees, managers, admins} = req.body

    try {
        const workout = await Workout.create({title, description, employees, managers, admins})
        res.status(200).json(workout)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

//DELETE an object
router.delete('/:id', (req, res) => {
    res.json({mssg: 'DELETE an object'})
})

//UPDATE an object
router.patch('/:id', (req, res) => {
    res.json({mssg: 'UPDATE an object'})
})

module.exports = router