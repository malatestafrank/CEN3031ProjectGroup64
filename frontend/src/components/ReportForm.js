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
  const [sumTotal, setSumTotal] = useState(0)
  const [sumHours, setSumHours] = useState('')
  const [sumMinutes, setSumMinutes] = useState('')
  const [sumSeconds, setSumSeconds] = useState('')
  const [average, setAverage] = useState(0)
  const [averageHours, setAverageHours] = useState('')
  const [averageMinutes, setAverageMinutes] = useState('')
  const [averageSeconds, setAverageSeconds] = useState('')
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
  }, [dispatch, user])

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

   useEffect(() => {
      setAverage(sumTotal / timeEntries.filter(entry => entry.selectedEmployee === selectedEmployee && entry.projectTitle === projectTitle && entry.timeOut !== "Not Clocked Out").length)
      const hours = Math.floor(sumTotal / 3600);
      const minutes = Math.floor((sumTotal / 3600) / 60);
      const seconds = sumTotal % 60;
      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');
      setSumHours(formattedHours);
      setSumMinutes(formattedMinutes);
      setSumSeconds(formattedSeconds);
   }, [sumTotal])

   useEffect(() => {
      const hours = Math.floor(average / 3600);
      const minutes = Math.floor((average / 3600) / 60);
      const seconds = average % 60;
      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');
      setAverageHours(formattedHours);
      setAverageMinutes(formattedMinutes);
      setAverageSeconds(formattedSeconds);
   }, [average])


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
    {timeEntries.map((entry, index) => {
      if (entry.selectedEmployee === selectedEmployee && entry.projectTitle === projectTitle && entry.timeOut !== "Not Clocked Out") {
      const { dateIn, timeIn, dateOut, timeOut } = entry;

      const startDateString = dateIn + ' ' + timeIn;

      const endDateString = dateOut + ' ' + timeOut;

      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);

      const timeDifference = endDate - startDate;
      const totalSeconds = timeDifference / (1000);
      setSumTotal(sumTotal => sumTotal + totalSeconds);
      }
    })}    
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
      <button onClick={createReportText}>Create Report</button>
      </>)}
      
      
      
      {textVisible && (
        <div>
          <p>Total sessions clocked: {timeEntries.filter(entry => entry.selectedEmployee === selectedEmployee && entry.projectTitle === projectTitle && entry.timeOut !== "Not Clocked Out").length}</p>
          <p>Total time clocked: {sumHours}:{sumMinutes}:{sumSeconds}</p>
          <p>Average time per session: {averageHours}:{averageMinutes}:{averageSeconds}</p>
      
      
      
      </div>
      )}
   </div>
  )
}

export default ReportForm

