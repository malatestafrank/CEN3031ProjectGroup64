import React, { useState } from 'react'


import { useProjectsContext } from "../hooks/useProjectsContext"
import { useAuthContext } from "../hooks/useAuthContext"

import EditProjectPopup from './EditProjectPopup'

const ProjectDetails = ({ project }) => {
    const { dispatch } = useProjectsContext()
    const { user } = useAuthContext()

    const [isEditing, setIsEditing] = useState(false)


    const handleDelete = async () => {
        if(!user) {
            return
        }

        const response = await fetch('/api/projects/' + project._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(response.ok) {
            dispatch({type: 'DELETE_PROJECT', payload: json})
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

    const handleSubmitEdit = async (updatedProject) => {
        try {
            const response = await fetch('/api/projects/' + updatedProject._id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(updatedProject)
            })

            if (response.ok) {
                const updatedProjectFromServer = await response.json()
                dispatch({ type: 'UPDATE_PROJECT', payload: updatedProjectFromServer })
                handleCloseEdit()

                this.forceUpdate()

                console.log("Project updated successfully:", updatedProjectFromServer)
            } else {
                console.error("Failed to update project:", response.statusText)
            }

        } catch (error) {
            console.error("Error updating project:", error)
        }
    }

    return (
        <div className="project-details">
            <h4>{project.title}</h4>
            <p><strong>Description: </strong>{project.description}</p>
            {(user?.privilege === "admin") && <span className="material-symbols-outlined edit" onClick={handleEdit}>edit</span>}
            {(user?.privilege === "admin") && <span className="material-symbols-outlined delete" onClick={handleDelete}>delete</span>}
            {isEditing && (
                <EditProjectPopup project={project} onClose={handleCloseEdit} onSubmit={handleSubmitEdit} />
            )}
        </div>
    )
}

export default ProjectDetails