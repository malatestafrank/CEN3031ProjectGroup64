const ProjectDetails = ({ project }) => {
    return (
        <div className="project-details">
            <h4>{project.title}</h4>
            <p><strong>Description: </strong>{project.description}</p>
            <p><strong>Admin: </strong>{project.admins}</p>
        </div>
    )
}

export default ProjectDetails