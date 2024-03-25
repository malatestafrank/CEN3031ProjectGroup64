import { useState, useEffect } from "react"

const ReportForm = () => {
  const [selectedProject, setSelectedProject] = useState('')
  const [projects, setProjects] = useState('')
  const [selectedTimeRange, setSelectedTimeRange] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [textVisible, setTextVisible] = useState(false)


  useEffect(() => {
    const fetchProjects = async () => {
        const response = await fetch('/api/projects')
        const json = await response.json()

        if(response.ok) {
            setProjects(json)
        }
    }

    fetchProjects()
}, []) //[] means the effect will only fire when the page is first loaded


  const handleProjectSelection = (e) => {
    setSelectedProject(e.target.value)
    setTextVisible(false)
  }
  const handleTimeTangeSelection = (e) => {
    setSelectedTimeRange(e.target.value)
    setTextVisible(false)
  }
  const handleEmployeeSelection = (e) => {
    setSelectedEmployee(e.target.value)
    setTextVisible(false)
  }
  const createReportText = () => {
    setTextVisible(true)
  }

  return (

   <div>

    <h3>View Report</h3>
    
      <label>Select project to report:</label>
      <select id="project" value={selectedProject} onChange = {handleProjectSelection}>
        <option>Select</option>
        <option>All projects</option>
        {projects && projects.map((project) => (
      <option key={project._id}>{project.title}</option>
    ))}
      </select>
    
      <label>Select range of time:</label>
      <select value = {selectedTimeRange} onChange = {handleTimeTangeSelection}>
        <option>Select</option>
        <option>All ranges</option>
        <option>Less than 1 hour</option>
        <option>1-3 hours</option>
        <option>3-5 hours</option>
        <option>5-8 hours</option>
        <option>More than 8 hours</option>
      </select>

      <label>Select employee:</label>
      <select value = {selectedEmployee} onChange = {handleEmployeeSelection}>
      <option>Select</option>
        <option>All employees</option>
        <option>Employee A</option>
        <option>Employee B</option>
        <option>Employee C</option>
        <option>Employee D</option>
      </select>

      <button onClick={createReportText}>Create Report</button>
      {textVisible && (
        <div>
            <p>Total sessions clocked: {selectedEmployee}'s sessions</p>
            <p>Total time clocked: {selectedEmployee}'s time</p>
            <p>Average time per session: {selectedEmployee}'s average</p>
        </div>
      )}
   </div>
  )
}

export default ReportForm

