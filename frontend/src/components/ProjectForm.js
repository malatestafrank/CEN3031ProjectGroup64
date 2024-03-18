import { useState } from "react"

const ProjectForm = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [admins, setAdmins] = useState('')
    const [error, setError] = useState(null)
    //might add ability to add employees/managers from project form later on

    const handleSubmit = async (e) => {
        e.preventDefault()

        const project = {title, description, admins}

        const response = await fetch('/api/projects', {
            method: 'POST',
            body: JSON.stringify(project),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()

        if(!response.ok) {
            setError(json.error)
        }
        if(response.ok) {
            setTitle('')
            setDescription('')
            setAdmins('')
            setError(null)
            console.log('new project added', json)
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

            <label>Input Admin ID:</label>
            <input
            type="number"
            onChange={(e) => setAdmins(e.target.value)}
            value={admins}
            />
           
           <button>Add Project</button>
           {error && <div className="error">{error}</div>}
        </form>

    )
}

export default ProjectForm