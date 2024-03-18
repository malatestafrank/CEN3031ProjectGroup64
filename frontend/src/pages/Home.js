import { useEffect, useState } from "react"

//components
import ProjectDetails from '../components/ProjectDetails'
import ProjectForm from "../components/ProjectForm"

const Home = () => {
    const [projects, setProjects] = useState(null)

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

    return (
        <div className="home">
            <div className="projects">
                {projects && projects.map((project) => (
                    <ProjectDetails key={project._id} project={project}></ProjectDetails>
                ))}
            </div>
            <ProjectForm></ProjectForm>
        </div>
    )
}

export default Home