import { useProjectsContext } from "../hooks/useProjectsContext"
import { useAuthContext } from "../hooks/useAuthContext"

const ProjectDetails = ({ project }) => {
    const { dispatch } = useProjectsContext()
    const { user } = useAuthContext()

    const handleClick = async () => {
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

    const handleEdit = async () => {
        
    }

    return (
        <div className="project-details">
            <h4>{project.title}</h4>
            <p><strong>Description: </strong>{project.description}</p>
            <span className="material-symbols-outlined edit" onClick={handleEdit}>edit</span>
            <span className="material-symbols-outlined delete" onClick={handleClick}>delete</span>
        </div>
    )
}

export default ProjectDetails