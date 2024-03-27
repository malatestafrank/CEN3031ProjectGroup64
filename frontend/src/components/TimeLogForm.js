import { useState, useEffect } from "react"
import { useProjectsContext } from "../hooks/useProjectsContext"
import { useAuthContext } from "../hooks/useAuthContext"

const TimeLogForm = () => {
    const [selectedProject, setSelectedProject] = useState('')
    const[startTime, setStartTime] = useState('')
    const[endTime, setEndTime] = useState('')
    const[startDate, setStartDate] = useState('')
    const[endDate, setEndDate] = useState('')
    const {projects, dispatch} = useProjectsContext()
    const {user} = useAuthContext()

    useEffect(() => {
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

    const handleProjectSelection = (e) => {
      setSelectedProject(e.target.value)
    }
    const handleStartTimeSelection = (e) => {
      setStartTime(e.target.value)
    }
    const handleEndTimeSelection = (e) => {
      setEndTime(e.target.value)
    }
    const handleStartDateSelection = (e) => {
      setStartDate(e.target.value)
    }
    const handleEndDateSelection = (e) => {
      setEndDate(e.target.value)
    }
    const handleSubmit = async (e) => {
      e.preventDefault()
  }

    return (
      
      <form onSubmit={handleSubmit}>

      <h3>Time Logging Form</h3>
      
      <div>
        <label>Select Project to Log Time</label>
        <select id="project" value={selectedProject} onChange = {handleProjectSelection}>
          <option>Select</option>
          {projects && projects.map((project) => (
        <option key={project._id}>{project.title}</option>
      ))}
        </select>
      </div>
  
      <label>Clock In Time: </label>
      <input type='text' onChange={handleStartTimeSelection}/>
      <p>You typed {startTime}</p>

      <label>Clock In Date: </label>
      <input type='date' onChange={handleStartDateSelection}/>
      <p>You typed {startDate}</p>
  
      <label>Clock Out Time: </label>
      <input type='text' onChange={handleEndTimeSelection}/>
      <p>You typed {endTime}</p>

      <label>Clock Out Date: </label>
      <input type='date' onChange={handleEndDateSelection}/>
      <p>You typed {endDate}</p>
  
      <button type ='submit'>Submit Time</button> 
     </form>
    )
}

export default TimeLogForm