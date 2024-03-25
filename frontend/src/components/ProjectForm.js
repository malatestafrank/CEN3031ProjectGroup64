import { useState } from "react"
import { useProjectsContext } from "../hooks/useProjectsContext"
import { useAuthContext } from "../hooks/useAuthContext"

const ProjectForm = () => {
    const { dispatch } = useProjectsContext()
    const { user } = useAuthContext()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null)
    //might add ability to add employees/managers from project form later on

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!user) {
            setError('You must be logged in')
            return
        }

        const project = {title, description}

        const response = await fetch('/api/projects', {
            method: 'POST',
            body: JSON.stringify(project),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(!response.ok) {
            setError(json.error)
        }
        if(response.ok) {
            setTitle('')
            setDescription('')
            setError(null)
            console.log('new project added', json)
            dispatch({type: 'CREATE_PROJECT', payload: json})
        }
    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Create a New Project</h3>  

            <label>Project Title:</label>
            <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            />

            <label>Project Description:</label>
            <input
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            />
           
           <button>Add Project</button>
           {error && <div className="error">{error}</div>}
        </form>

    )
}

export default ProjectForm