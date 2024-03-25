const Project = require('../models/projectModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')

//get all projects
const getProjects = async (req, res) => {
    const user_id = req.user._id
    const user = await User.findById(user_id)
    const privilege = user.privilege
    const email = user.email

    if(privilege === 'admin') {
        const projects = await Project.find({})
        return res.status(200).json(projects)
    }else {
        const projects = await Project.find({
            $or: [
                { employees: { $in: [email] } },
                { managers: { $in: [email] } },
            ]
        })
        return res.status(200).json(projects)
    }
}

//get a single project
const getProject = async (req, res) => {
    const{id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Project Not Found'})
    }

    const project = await Project.findById(id)

    if(!project) {
        return res.status(404).json({error: 'Project Not Found'})
    }

    res.status(200).json(project)
}

//create new project
const createProject = async (req, res) => {
    const {title, description, employeeEmails, managerEmails} = req.body

    //add doc to db
    try {
        const project = await Project.create({title, description, employeeEmails, managerEmails})
        res.status(200).json(project)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//delete a project
const deleteProject = async (req, res) => {
    const{id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Project Not Found'})
    }

    const project = await Project.findOneAndDelete({_id: id})

    if(!project) {
        return res.status(400).json({error: 'Project Not Found'})
    }

    res.status(200).json(project)
}

//update a project
const updateProject = async (req, res) => {
    const{id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Project Not Found'})
    }

    const project = await Project.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if(!project) {
        return res.status(400).json({error: 'Project Not Found'})
    }

    res.status(200).json(project)
}

module.exports = {
    createProject,
    getProjects,
    getProject,
    deleteProject,
    updateProject

}