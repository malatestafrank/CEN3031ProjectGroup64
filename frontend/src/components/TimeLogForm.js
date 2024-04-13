import { useState, useEffect } from "react"
import { useProjectsContext } from "../hooks/useProjectsContext"
import { useAuthContext } from "../hooks/useAuthContext"

const TimeLogForm = () => {
    const [projectTitle, setProjectTitle] = useState('')
    const[timeIn, setTimeIn] = useState('')
    const[timeOut, setTimeOut] = useState('')
    const[dateIn, setDateIn] = useState('')
    const[dateOut, setDateOut] = useState('')
    const [employees, setEmployees] = useState([])
    const[selectedEmployee, setSelectedEmployee] = useState('')
    const [managers, setManagers] = useState([])
    const[selectedManager, setSelectedManager] = useState('')
    const [error, setError] = useState(null)
    const {projects, dispatch} = useProjectsContext()
    const {user} = useAuthContext()

    useEffect(() => {
        fetchUserEmails()
        const fetchProjects = async () => {
            const response = await fetch('/api/projects', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if(response.ok) {
                dispatch({type: 'SET_PROJECTS', payload: json})
            }
        }
        if(user) {
            fetchProjects()
        }
    }, [dispatch, user]) //[] means the effect will only fire when the page is first loaded

    const fetchUserEmails = async () => {
      const res = await fetch('/api/user')
      const json = await res.json()

      if(res.ok) {
          const employeeEmails = json.filter((user) => user.privilege === 'employee').map((employee) => employee.email)
          const managerEmails = json.filter((user) => user.privilege === 'manager').map((manager) => manager.email)

          setEmployees(employeeEmails)
          setManagers(managerEmails)
          console.log("success!")
      }
      else{
        console.log('failed to get emails')
      }
  }

    const handleEmployeeSelection = (e) => {
      setSelectedEmployee(e.target.value)
    }
    const handleManagerSelection = (e) => {
      setSelectedManager(e.target.value)
    }

    const handleProjectSelection = (e) => {
      setProjectTitle(e.target.value)
    }
    const handleStartTimeSelection = (e) => {
      setTimeIn(e.target.value)
    }
    const handleEndTimeSelection = (e) => {
      setTimeOut(e.target.value)
    }
    const handleStartDateSelection = (e) => {
      setDateIn(e.target.value)
    }
    const handleEndDateSelection = (e) => {
      setDateOut(e.target.value)
    }
    const handleSubmit = async (e) => {
      e.preventDefault()
      console.log(selectedEmployee)
      console.log(selectedManager)
      const timelog={projectTitle, selectedEmployee, selectedManager, timeIn, timeOut, dateIn, dateOut}
      const response = await fetch('/api/time', {
        method: 'POST',
        body: JSON.stringify(timelog),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const json = await response.json()

    if(!response.ok) {
        setError(json.error)
    }
    if(response.ok) {
        setProjectTitle('')
        setSelectedEmployee('')
        setSelectedManager('')
        setTimeIn('')
        setTimeOut('')
        setDateIn('')
        setDateOut('')
        setError(null)
        console.log('new timelog added', json)
    }

  }

    return (
      
      <form onSubmit={handleSubmit}>

      <h3>Time Logging Form</h3>
      
      <div>
        <label>Select Project to Log Time</label>
        <select id="project" value={projectTitle} onChange = {handleProjectSelection}>
          {projects && projects.map((project) => (
        <option key={project._id}>{project.title}</option>
      ))}
        </select>
      </div>
      <p>You typed {projectTitle}</p>

      <label>Add Employees:</label>
            <select multiple className="employee-list" value={selectedEmployee} onChange={handleEmployeeSelection}>
                {employees.map((email) => (
                    <option key={email} value={email}>
                        {email}    
                    </option>
                ))}
            </select>
      <p>You typed {selectedEmployee}</p>


      <label>Add Managers:</label>
            <select multiple className="manager-list" value={selectedManager} onChange={handleManagerSelection}>
                {managers.map((email) => (
                    <option key={email} value={email}>
                        {email}    
                    </option>
                ))}
            </select>
            <p>You typed {selectedManager}</p>
          
  
      <label>Clock In Time: </label>
      <input type='text' value={timeIn}onChange={handleStartTimeSelection}/>
      <p>You typed {timeIn}</p>

      <label>Clock In Date: </label>
      <input type='date' value={dateIn} onChange={handleStartDateSelection}/>
      <p>You typed {dateIn}</p>
  
      <label>Clock Out Time: </label>
      <input type='text' value ={timeOut} onChange={handleEndTimeSelection}/>
      <p>You typed {timeOut}</p>

      <label>Clock Out Date: </label>
      <input type='date' value={dateOut} onChange={handleEndDateSelection}/>
      <p>You typed {dateOut}</p>
  
      <button type ='submit'>Submit Time</button> 
     </form>
    )
}

export default TimeLogForm