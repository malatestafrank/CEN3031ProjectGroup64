import { useState, useEffect } from "react"
import { useProjectsContext } from "../hooks/useProjectsContext"
import { useAuthContext } from "../hooks/useAuthContext"

const TimeLogForm = () => {
    const [projectTitle, setProjectTitle] = useState('')
    const[timeIn, setTimeIn] = useState('')
    const[timeOut, setTimeOut] = useState('')
    const[dateIn, setDateIn] = useState('')
    const[dateOut, setDateOut] = useState('')
    const [error, setError] = useState(null)
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
      console.log(projectTitle)
      console.log(timeIn)
      console.log(timeOut)
      const timelog={projectTitle, timeIn, timeOut, dateIn, dateOut}
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
          <option>Select</option>
          {projects && projects.map((project) => (
        <option key={project._id}>{project.title}</option>
      ))}
        </select>
      </div>
      <p>You typed {projectTitle}</p>
  
      <label>Clock In Time: </label>
      <input type='text' onChange={handleStartTimeSelection}/>
      <p>You typed {timeIn}</p>

      <label>Clock In Date: </label>
      <input type='date' onChange={handleStartDateSelection}/>
      <p>You typed {dateIn}</p>
  
      <label>Clock Out Time: </label>
      <input type='text' onChange={handleEndTimeSelection}/>
      <p>You typed {timeOut}</p>

      <label>Clock Out Date: </label>
      <input type='date' onChange={handleEndDateSelection}/>
      <p>You typed {dateOut}</p>
  
      <button type ='submit'>Submit Time</button> 
     </form>
    )
}

export default TimeLogForm