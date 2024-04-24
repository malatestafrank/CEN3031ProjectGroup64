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
    const[selectedProject, setSelectedProject] = useState('')
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

    useEffect(() => {
      if (projects){
        const project = projects.find(project=>project.title == projectTitle)
        if (project){
          setSelectedProject(project)
        }
        else{
          setSelectedProject("")
        }
      }
    }, [projects, projectTitle])

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
      setSelectedEmployee('')
      setSelectedManager('')
    }
    const handleEndTimeSelection = (e) => {
      setTimeOut(e.target.value)
    }
    const handleEndDateSelection = (e) => {
      setDateOut(e.target.value)
    }
    const handleCLockInSubmit = async (e) => {
      e.preventDefault()
      const currentTime = new Date()
      setTimeIn(currentTime.toLocaleTimeString())
      setDateIn(currentTime.toLocaleDateString())
      const timelog={projectTitle, selectedEmployee, selectedManager, timeIn: currentTime.toLocaleTimeString(), dateIn: currentTime.toLocaleDateString()}
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
        const currentTimeClockOut = new Date()
        console.log(projectTitle)
        console.log(selectedEmployee)
        console.log(selectedManager)
        console.log(timeIn)
        console.log(dateIn)
        console.log(timeOut)
        console.log(dateOut)
        const encodedprojectTitle = encodeURIComponent(projectTitle)
        const encodedselectedEmployee = encodeURIComponent(selectedEmployee)
        const encodedselectedManager = encodeURIComponent(selectedManager)
        const encodedtimeIn = encodeURIComponent(timeIn)
        const encodeddateIn = encodeURIComponent(dateIn)
        const response = await fetch(`
        /api/time/id?projectTitle=${encodedprojectTitle}&selectedEmployee=${encodedselectedEmployee}&selectedManager=${encodedselectedManager}&timeIn=${encodedtimeIn}&timeOut=Not%20Clocked%20Out&dateIn=${encodeddateIn}&dateOut=Not%20Clocked%20Out`, {
        method: 'GET'
        })
        const timelogID = await response.json()
        if(response.ok) {
          console.log('new update added', timelogID)
      }
      const patchResponse = await fetch(`/api/time/original/${timelogID}`, {
        method: 'PATCH',
        body: JSON.stringify({timeOut:currentTimeClockOut.toLocaleTimeString(), dateOut:currentTimeClockOut.toLocaleDateString()}),
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
        setSelectedProject('')
        setError(null)
        setClockInSubmitted(false)
  }

    return (
      
      <form onSubmit={!clockInSubmitted? handleCLockInSubmit : handleClockOutSubmit}>

      <h3>Time Logging Form</h3>

      {!clockInSubmitted? (<><label>Select Project to Log Time:</label>
        <select className='project-list' value={projectTitle} onChange = {handleProjectSelection} required>
          <option value="">Select Project</option>
          {projects && projects.map((project) => (
        <option key={project._id}>{project.title}</option>
      ))}
        </select>

      <p>You selected {projectTitle}</p></>) : null}
      {selectedProject && !clockInSubmitted && (user?.privilege === "admin" || user?.privilege === "employee") && (<>
      <label>Add Employees:</label>
            <select className="employee-list" value={selectedEmployee} onChange={handleEmployeeSelection} required>
              <option value="">Select Employee</option>
                {selectedProject.employees.map((email) => (
                    <option key={email} value={email}>
                        {email}    
                    </option>
                ))}
            </select>
      <p>You selected {selectedEmployee}</p></>)}
      

      {selectedProject && !clockInSubmitted && (user?.privilege === "admin" || user?.privilege === "manager") && (<>
      <label>Add Managers:</label>
            <select className="manager-list" value={selectedManager} onChange={handleManagerSelection} required>
              <option value="">Select Manager</option>
                {selectedProject.managers.map((email) => (
                    <option key={email} value={email}>
                        {email}    
                    </option>
                ))}
            </select>
            <p>You selected {selectedManager}</p></>)}


      <button type ='submit'>{!clockInSubmitted? 'Clock In' : 'Clock Out'}</button> 
     </form>
    )
}

export default TimeLogForm