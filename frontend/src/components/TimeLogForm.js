import { useState, useEffect } from "react"

const TimeLogForm = () => {
  const [selectedProject, setSelectedProject] = useState('')
  const [projects, setProjects] = useState('')


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
  }
  return (

   <form>

    <h3>Time Logging Form</h3>
    
    <div>
      <label>Select Project to Log Time</label>
      <select id="project" value={selectedProject} onChange = {handleProjectSelection}>
        <option>Select</option>
        {projects && projects.map((project) => (
      <option key={project._id}>{project.title}</option>
    ))}
      </select>
      <p>You selected : {selectedProject}</p>
    </div>

    <label>Clock In Time: </label>
    <input type='number'/>

    <label>Clock Out Time: </label>
    <input type='number'/>

    <button type ='submit'>Submit Time</button> 
   </form>
  )
}

export default TimeLogForm

