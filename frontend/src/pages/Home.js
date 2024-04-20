import { useEffect } from "react"
import { useProjectsContext } from "../hooks/useProjectsContext"
import { useAuthContext } from "../hooks/useAuthContext"

//components
import ProjectDetails from '../components/ProjectDetails'
import ProjectForm from "../components/ProjectForm"
import TimeLogForm from "../components/TimeLogForm"
import ReportForm from "../components/ReportForm"
import TimeLogDetails from "../components/TimeLogDetails"

const Home = () => {
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
    }, [dispatch, user, projects]) //[] means the effect will only fire when the page is first loaded

    return (
        <div className="home">
            <div className="projects">
                {projects && projects.map((project) => (
                    <ProjectDetails key={project._id} project={project}>
                        {(user?.privilege === "admin" || project.employees.includes(user?.email) || project.managers.includes(user?.email))}
                    </ProjectDetails>
                ))}
            </div>
            {(user?.privilege === 'admin') && <ProjectForm></ProjectForm> }
            <TimeLogForm></TimeLogForm>
            <TimeLogDetails></TimeLogDetails>
            <ReportForm></ReportForm>
        </div>
        
    )
}

export default Home