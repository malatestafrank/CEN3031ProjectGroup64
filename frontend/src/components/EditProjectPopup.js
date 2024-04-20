import React, { useState, useEffect } from 'react'

const EditProjectPopup = ({project, onClose, onSubmit}) => {
    
    const [updatedProject, setUpdatedProject] = useState(project)
    const [availableEmployees, setAvailableEmployees] = useState([])
    const [availableManagers, setAvailableManagers] = useState([])

    useEffect(() => {
        fetchUserEmails()

        //prevent users scrolling while in edit window
        window.addEventListener('keydown', preventScroll)

        
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', preventScroll)
            document.body.style.overflow = 'auto'
        }

    }, [])

    const fetchUserEmails = async () => {
        const res = await fetch('/api/user')
        const json = await res.json()

        if(res.ok) {
            const allEmployeeEmails = json.filter(user => user.privilege === 'employee').map(user => user.email)
                const allManagerEmails = json.filter(user => user.privilege === 'manager').map(user => user.email)

                const filteredEmployeeEmails = allEmployeeEmails.filter(email => !updatedProject.employees.includes(email))
                const filteredManagerEmails = allManagerEmails.filter(email => !updatedProject.managers.includes(email))

                setAvailableEmployees(filteredEmployeeEmails)
                setAvailableManagers(filteredManagerEmails)
        }
    }

    const preventScroll = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault()
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setUpdatedProject(prevProject => ({
            ...prevProject,
            [name]: value
        }))
    }

    const handleAddEmployee = (email) => {
        setUpdatedProject(prevProject => ({
            ...prevProject,
            employees: [...prevProject.employees, email]
        }))
        setAvailableEmployees(availableEmployees.filter(e => e !== email))
    }

    const handleAddManager = (email) => {
        setUpdatedProject(prevProject => ({
            ...prevProject,
            managers: [...prevProject.managers, email]
        }))
        setAvailableManagers(availableManagers.filter(m => m !== email))
    }

    const handleRemoveEmployee = (email) => {
        setUpdatedProject(prevProject => ({
            ...prevProject,
            employees: prevProject.employees.filter(e => e !== email)
        }))
        setAvailableEmployees([...availableEmployees, email])
    }

    const handleRemoveManager = (email) => {
        setUpdatedProject(prevProject => ({
            ...prevProject,
            managers: prevProject.managers.filter(m => m !== email)
        }))
        setAvailableManagers([...availableManagers, email])
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

                <div>
                    <label>Add Employees:</label>
                    <select multiple>
                        {availableEmployees.map(email => (
                            <option key={email} onClick={() => handleAddEmployee(email)}>{email}</option>
                        ))}
                    </select>
                    <label>Attributed Employees:</label>
                    <ul>
                        {updatedProject.employees.map(email => (
                            <li key={email}>
                                {email}
                                <button onClick={() => handleRemoveEmployee(email)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <label>Add Managers:</label>
                    <select multiple>
                        {availableManagers.map(email => (
                            <option key={email} onClick={() => handleAddManager(email)}>{email}</option>
                        ))}
                    </select>
                    <label>Attributed Managers:</label>
                    <ul>
                        {updatedProject.managers.map(email => (
                            <li key={email}>
                                {email}
                                <button onClick={() => handleRemoveManager(email)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>

                

                <button onClick={handleSubmit}>Confirm Changes</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    )
}

export default EditProjectPopup