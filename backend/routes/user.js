const express = require('express')

//controller functions
const { signupUser, loginUser } = require('../controllers/userController')

const router = express.Router()

//login route
router.post('/login', loginUser)

//signup route (this will be removed in the future, just using it for testing now)
router.post('/signup', signupUser)

module.exports = router