import { useState, useEffect } from "react"
import { useProjectsContext } from "../hooks/useProjectsContext"
import { useAuthContext } from "../hooks/useAuthContext"

const ProjectForm = () => {
    const { dispatch } = useProjectsContext()
    const { user } = useAuthContext()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null)
    //might add ability to add employees/managers from project form later on
    const [availableEmployees, setAvailableEmployees] = useState([])
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const [availableManagers, setAvailableManagers] = useState([])
    const [selectedManagers, setSelectedManagers] = useState([])

    //fetch employee and manager emails
    useEffect(() => {
        const fetchUserEmails = async () => {
            const res = await fetch('/api/user')
            const json = await res.json()

            if(res.ok) {
                const employeeEmails = json.filter((user) => user.privilege === 'employee').map((employee) => employee.email)
                const managerEmails = json.filter((user) => user.privilege === 'manager').map((manager) => manager.email)

                setAvailableEmployees(employeeEmails)
                setAvailableManagers(managerEmails)
            }
        }
        fetchUserEmails()
    }, [])

    const handleEmployeeChange = (e) => {
        const selectedOptions = [...e.target.selectedOptions]
        const newSelectedEmployees = selectedOptions.map((option) => option.value)
        setSelectedEmployees([...selectedEmployees, ...newSelectedEmployees])

        const updatedAvailableEmployees = availableEmployees.filter(
            (email) => !newSelectedEmployees.includes(email)
        )
        setAvailableEmployees(updatedAvailableEmployees)

      };

    const handleRemoveAttributedEmployee = (email) => {
        //find the email within the selectedEmployees array
        const updatedSelectedEmployees = selectedEmployees.filter(
            (emp) => emp !== email
          )
        //then update the selectedEmployee array with the removed email
        setSelectedEmployees(updatedSelectedEmployees)
        //and add it back to availableEmployee array
        setAvailableEmployees([...availableEmployees, email])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!user) {
            setError('You must be logged in')
            return
        }

        const project = {title, description, selectedEmployees}

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
            setSelectedEmployees(null)
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

            <label>Add Employees:</label>
            <select multiple className="employee-list" value={selectedEmployees} onChange={handleEmployeeChange}>
                {availableEmployees.map((email) => (
                    <option
                        key={email}
                        value={email}
                        className={selectedEmployees.includes(email) ? "selected-option" : ""}>
                        {email}    
                    </option>
                ))}
            </select>

            <label>Attributed Employees:</label>
            <ul className="attributed-employees">
                {selectedEmployees.map((email) => (
                    <li key={email}>
                        {email}
                        <button onClick={() => handleRemoveAttributedEmployee(email)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
           
           <button>Add Project</button>
           {error && <div className="error">{error}</div>}
        </form>

    )
}

export default ProjectForm