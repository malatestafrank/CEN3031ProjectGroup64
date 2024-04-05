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
    const [employees, setEmployees] = useState([]);

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
        if(availableEmployees) {
        const selectedOptions = [...e.target.selectedOptions]
        const newEmployees = selectedOptions.map((option) => option.value)
        setEmployees([...employees, ...newEmployees])

        const updatedAvailableEmployees = availableEmployees.filter(
            (email) => !newEmployees.includes(email)
        )
        setAvailableEmployees(updatedAvailableEmployees)
        }else {
            setError('availableEmployees is null')
        }

      };

    const handleRemoveAttributedEmployee = (email) => {
        //find the email within the employees array
        const updatedEmployees = employees.filter(
            (emp) => emp !== email
          )
        //then update the selectedEmployee array with the removed email
        setEmployees(updatedEmployees)
        //and add it back to availableEmployee array
        setAvailableEmployees([...availableEmployees, email])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!user) {
            setError('You must be logged in')
            return
        }

        const project = {title, description, employees}

        
        console.log('--- Selected Employees:')
        if(employees) {
            employees.forEach((email) => {
                console.log(email)
            })
        }else {
            console.log('No selected employees.')
        }
        

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
            setEmployees([])
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
            <select multiple className="employee-list" value={employees} onChange={handleEmployeeChange}>
                {availableEmployees.map((email) => (
                    <option key={email} value={email}>
                        {email}    
                    </option>
                ))}
            </select>

            <label>Attributed Employees:</label>
            <ul className="attributed-employees">
                {employees.map((email) => (
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