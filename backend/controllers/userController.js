const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

//delete after testing
const getUsers = async (req, res) => {
    const users = await User.find({})

    res.status(200).json(users)
}


//login user
const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.login(email, password)
        const fullUser = await User.findById(user._id)

        //create a token
        const token = createToken(user._id)

        res.status(200).json({ email, token, privilege: fullUser.privilege })
    } catch (error) {
        res.status(400).json({error: error.message})
    }

}

//signup user
const signupUser = async (req, res) => {
    const {email, password, privilege} = req.body

    try {
        const user = await User.signup(email, password, privilege)

        //create a token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = { signupUser, loginUser, getUsers }