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
    const[clockInSubmitted, setClockInSubmitted] = useState(false)
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
    const handleCLockInSubmit = async (e) => {
      e.preventDefault()
      const timelog={projectTitle, selectedEmployee, selectedManager, timeIn, dateIn}
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
        setError(null)
        setClockInSubmitted(true)
        console.log('new timelog added', json)
    }

    }
    const handleClockOutSubmit = async (e) => {
        e.preventDefault()
        console.log(projectTitle)
        console.log(selectedEmployee)
        console.log(selectedManager)
        console.log(timeIn)
        console.log(dateIn)
        console.log(timeOut)
        console.log(dateOut)
        const response = await fetch(`
        /api/time/id?projectTitle=${projectTitle}&selectedEmployee=${selectedEmployee}&selectedManager=${selectedManager}&timeIn=${timeIn}&timeOut=Not%20Clocked%20Out&dateIn=${dateIn}&dateOut=Not%20Clocked%20Out`, {
        method: 'GET'
        })
        const timelogID = await response.json()
        if(response.ok) {
          console.log('new update added', timelogID)
      }
      const patchResponse = await fetch(`/api/time/${timelogID}`, {
        method: 'PATCH',
        body: JSON.stringify({timeOut, dateOut}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
      const json = await patchResponse.json()
      if (patchResponse.ok){
        console.log('patch successful', json)
      }
        setError(null)
        setProjectTitle('')
        setSelectedEmployee('')
        setSelectedManager('')
        setTimeIn('')
        setDateIn('')
        setTimeOut('')
        setDateOut('')
        setError(null)
        setClockInSubmitted(false)
  }

    return (
      
      <form onSubmit={!clockInSubmitted? handleCLockInSubmit : handleClockOutSubmit}>

      <h3>Time Logging Form</h3>
      
        {!clockInSubmitted? (<><label>Select Project to Log Time:</label>
        <select multiple className='project-list' value={projectTitle} onChange = {handleProjectSelection}>
          {projects && projects.map((project) => (
        <option key={project._id}>{project.title}</option>
      ))}
        </select>
      <p>You typed {projectTitle}</p></>) : null}

      {!clockInSubmitted? (<><label>Add Employees:</label>
            <select multiple className="employee-list" value={selectedEmployee} onChange={handleEmployeeSelection}>
                {employees.map((email) => (
                    <option key={email} value={email}>
                        {email}    
                    </option>
                ))}
            </select>
      <p>You typed {selectedEmployee}</p></>) : null}

      {!clockInSubmitted? (<>  <label>Add Managers:</label>
            <select multiple className="manager-list" value={selectedManager} onChange={handleManagerSelection}>
                {managers.map((email) => (
                    <option key={email} value={email}>
                        {email}    
                    </option>
                ))}
            </select>
            <p>You typed {selectedManager}</p></>) : null}

      {!clockInSubmitted? (<><label>Clock In Time: </label>
      <input type='text' value={timeIn}onChange={handleStartTimeSelection}/>
      <p>You typed {timeIn}</p></>) : null}

      {!clockInSubmitted? (<><label>Clock In Date: </label>
      <input type='date' value={dateIn} onChange={handleStartDateSelection}/>
      <p>You typed {dateIn}</p></>) : null}

      {clockInSubmitted? (<><label>Clock Out Time: </label>
      <input type='text' value ={timeOut} onChange={handleEndTimeSelection}/>
      <p>You typed {timeOut}</p></>) : null}

      {clockInSubmitted? (<>  <label>Clock Out Date: </label>
      <input type='date' value={dateOut} onChange={handleEndDateSelection}/>
      <p>You typed {dateOut}</p></>) : null}

      <button type ='submit'>{!clockInSubmitted? 'Clock In' : 'Clock Out'}</button> 
     </form>
    )
}

export default TimeLogForm