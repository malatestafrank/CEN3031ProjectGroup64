import { useEffect } from "react"
import { useProjectsContext } from "../hooks/useProjectsContext"
import { useAuthContext } from "../hooks/useAuthContext"

//components
import ProjectDetails from '../components/ProjectDetails'
import ProjectForm from "../components/ProjectForm"
import TimeLogForm from "../components/TimeLogForm"

const Home = () => {
    const {projects, dispatch} = useProjectsContext()
    const {isAdmin} = useAuthContext()

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('/api/projects')
            const json = await response.json()

            if(response.ok) {
                dispatch({type: 'SET_PROJECTS', payload: json})
            }
        }

        fetchProjects()
    }, []) //[] means the effect will only fire when the page is first loaded

    return (
        <div className="home">
            <div className="projects">
                {projects && projects.map((project) => (
                    <ProjectDetails key={project._id} project={project}></ProjectDetails>
                ))}
            </div>
            {isAdmin() && <ProjectForm></ProjectForm> }
            <TimeLogForm></TimeLogForm>
        </div>
        
    )
}

export default Home