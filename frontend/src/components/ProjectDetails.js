import { useProjectsContext } from "../hooks/useProjectsContext"

const ProjectDetails = ({ project }) => {
    const { dispatch } = useProjectsContext()

    const handleClick = async () => {
        const response = await fetch('/api/projects/' + project._id, {
            method: 'DELETE'
        })
        const json = await response.json()

        if(response.ok) {
            dispatch({type: 'DELETE_PROJECT', payload: json})
        }
    }

    return (
        <div className="project-details">
            <h4>{project.title}</h4>
            <p><strong>Description: </strong>{project.description}</p>
            <p><strong>Admin: </strong>{project.admins}</p>
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        </div>
    )
}

export default ProjectDetails