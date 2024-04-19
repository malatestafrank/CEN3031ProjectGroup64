import React, { useState } from 'react'

const EditProjectPopup = ({project, onClose, onSubmit}) => {
    
    const [updatedProject, setUpdatedProject] = useState(project);

    const handleChange = (e) => {
        const { name, value } = e.target
        setUpdatedProject(prevProject => ({
            ...prevProject,
            [name]: value
        }))
    }

    const handleSubmit = () => {
        onSubmit(updatedProject)
        onClose()
    }

    return (
        <div className='editproject-popup'>
            <div className='editproject-popup-inner'>
                <h2>Edit Project</h2>
                <label>Project Title:</label>
                <input type='text' name='title' value={updatedProject.title} onChange={handleChange} />
                <label>Project Description:</label>
                <input type='text' name='description' value={updatedProject.description} onChange={handleChange} />
                <button onClick={handleSubmit}>Confirm Changes</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    )
}

export default EditProjectPopup