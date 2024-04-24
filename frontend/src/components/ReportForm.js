import { useState, useEffect } from "react"
import { useProjectsContext } from "../hooks/useProjectsContext"
import { useAuthContext } from "../hooks/useAuthContext"

const ReportForm = () => {
  const[timeEntries, setTimeEntries] = useState([])
  const [projectTitle, setProjectTitle] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedTimeRange, setSelectedTimeRange] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [textVisible, setTextVisible] = useState(false)
  const [employees, setEmployees] = useState([])
  const [managers, setManagers] = useState([])
  const[selectedManager, setSelectedManager] = useState('')
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

  useEffect(() => {
    fetchTimeEntries()
   }, [])

   const fetchTimeEntries = async () =>{
       const response = await fetch('/api/time')
       if(response.ok){
           const json = await response.json()
           setTimeEntries(json)
           console.log(json)
       }
       else{
           console.log("Failed to retrieve Time Entries")
       }
   }

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
    setSelectedTimeRange('')
    setTextVisible(false)
  }

  const handleManagerSelection = (e) => {
    setSelectedManager(e.target.value)
    setTextVisible(false)
  } 

  const handleProjectSelection = (e) => {
    setProjectTitle(e.target.value)
    setSelectedEmployee('')
    setSelectedManager('')
    setTextVisible(false)
  }

  const handleTimeTangeSelection = (e) => {
    setSelectedTimeRange(e.target.value)
    setTextVisible(false)
  }

  const createReportText = () => {
    setTextVisible(true)
  }

  return (

   <div>

    <h3>View Report</h3>
      {<><label>Select project to generate report about:</label>
      <select className='project-list' value={projectTitle} onChange={handleProjectSelection} required>
      <option value="">Select Project</option>
      {projects && projects.map((project) => (
      <option key={project._id}>{project.title}</option>
      ))}
      </select>
      {projectTitle && <p>You selected {projectTitle}</p>}
      </>}


      {selectedProject && (<>
      <label>Select employee:</label>
      <select className="employee-list" value={selectedEmployee} onChange={handleEmployeeSelection} required>
      <option value="">Select Employee</option>
      {selectedProject.employees.map((email) => (
      <option key={email} value={email}>
        {email}    
      </option>
      ))}
      {(user?.privilege === "admin" || user?.privilege === "manager") && (<>
      {selectedProject.managers.map((email) => (
      <option key={email} value={email}>
        {email}    
      </option>
      ))}
      </>)}
      </select>
      {selectedEmployee && <p>You selected {selectedEmployee}</p>}
      </>)}





      {selectedEmployee && (<>
      <label>Select time range:</label>
      <select value = {selectedTimeRange} onChange = {handleTimeTangeSelection}>
        <option value="">Select Time Range</option>
        <option>All ranges</option>
        <option>Less than 1 hour</option>
        <option>1-3 hours</option>
        <option>3-5 hours</option>
        <option>5-8 hours</option>
        <option>More than 8 hours</option>
      </select>
      {selectedTimeRange && <p>You selected {selectedTimeRange}</p>}
      </>)}

      {selectedTimeRange && (<>
      <button onClick={createReportText}>Create Report</button>
      </>)}
      
      
      
      {textVisible && (
        <div>
          <p>Total sessions clocked: {selectedEmployee}'s sessions</p>
          <p>Total time clocked: {selectedEmployee}'s time</p>
          <p>Average time per session: {selectedEmployee}'s average</p>
          {timeEntries.map((entry, index) => {
            if (entry.selectedEmployee === selectedEmployee && entry.projectTitle === projectTitle) {
              return <p key={index}>{entry.timeIn}</p>;
            } else {
              return null; // or any other placeholder if you don't want to render anything
            }
          })}
          <p>Count: {timeEntries.filter(entry => entry.selectedEmployee === selectedEmployee && entry.projectTitle === projectTitle).length}</p>
        </div>
      )}
   </div>
  )
}

export default ReportForm

