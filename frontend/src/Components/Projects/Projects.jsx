import React, { useEffect, useState } from 'react';
import CreateProjects from './CreateProjects/CreateProjects';
import './Projects.css';
import CreateTasks from '../Tasks/CreateTasks/CreateTasks';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProjects();
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
        deadline: project.deadline ? project.deadline.split('T')[0] : ''
      })));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleEdit = (projectId) => {
    const projectToEdit = projects.find(project => project._id === projectId);
    setEditingProject(projectToEdit);
    setIsProjectModalOpen(true);
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

      setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleAddTask = (project) => {
    setSelectedProject(project);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProjectModalOpen(false);
    setIsTaskModalOpen(false);
    setEditingProject(null); // Reset editingProject when modal is closed
  };

  const openCreateProjectModal = () => {
    setEditingProject(null); // Reset editingProject to null
    setIsProjectModalOpen(true);
  };

  return (
    <div>
      <div className="project-grid">
        <div className="default project-container">
          <button onClick={openCreateProjectModal}>Create Project</button>
        </div>
        {projects.map(project => (
          <div className="project-container" key={project._id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="position-deadline">
              <p>Status: {project.position}</p>
              <p className="deadline">Deadline: {project.deadline}</p>
            </div>
            <div className="project-actions">
              <FaEdit onClick={() => handleEdit(project._id)} />
              <FaTrash onClick={() => handleDelete(project._id)} />
              <button onClick={() => handleAddTask(project)}>Assign Tasks</button>
            </div>
          </div>
        ))}
      </div>
      {isProjectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>X</button>
            <CreateProjects token={token} editingProject={editingProject} />
          </div>
        </div>
      )}
      {isTaskModalOpen && selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content assign-tasks-modal-content">
            <button className="close-button assign-task-close-button" onClick={handleCloseModal}>X</button>
            <CreateTasks 
              projectId={selectedProject._id} 
              token={token} 
              projectTitle={selectedProject.title} 
              projectDescription={selectedProject.description} 
              projectDeadline={selectedProject.deadline} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
