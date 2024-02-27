const express = require('express')

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
router.post('/', (req, res) => {
    res.json({mssg: 'POST a new object'})
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