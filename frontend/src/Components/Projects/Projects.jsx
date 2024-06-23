import React, { useEffect, useState } from 'react';
import CreateProjects from './CreateProjects/CreateProjects';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // Track editing project
  const token = localStorage.getItem('token'); // Assume token is stored in localStorage

  useEffect(() => {
    fetchProjects(); // Fetch projects when component mounts
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects/get', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
  
      const projectsData = await response.json();
      setProjects(projectsData.map(project => ({
        ...project,
        deadline: project.deadline ? project.deadline.split('T')[0] : '' // Extract date part only
      })));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleEdit = (projectId) => {
    const projectToEdit = projects.find(project => project._id === projectId);
    setEditingProject(projectToEdit);
    setIsModalOpen(true); // Open the modal for editing
  };

  const handleDelete = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/delete/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      // Remove the deleted project from state
      setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleAddTask = async (projectId) => {
    console.log(`Adding task to project with ID: ${projectId}`);
    // Implement task addition logic, e.g., open a modal to add tasks
  };

  const handleOpenModal = () => {
    setEditingProject(null); // Clear editing project state
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="project-grid">
        <div className="default project-container">
          <button onClick={handleOpenModal}>Create Project</button>
        </div>
        {projects.map(project => (
          <div className="project-container" key={project._id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>Deadline: {project.deadline}</p> {/* Display only date */}
            <div className="project-actions">
              <button onClick={() => handleEdit(project._id)}>Edit</button>
              <button onClick={() => handleDelete(project._id)}>Delete</button>
              <button onClick={() => handleAddTask(project._id)}>Assign Tasks</button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>X</button>
            <CreateProjects token={token} editingProject={editingProject} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
