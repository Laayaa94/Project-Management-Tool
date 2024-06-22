import React, { useState } from 'react';
import CreateProjects from './CreateProjects/CreateProjects';
import './Projects.css';

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem('token'); // Assume token is stored in localStorage

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = () => {
    // Implement edit functionality
  };

  const handleDelete = () => {
    // Implement delete functionality
  };

  const handleAddTask = () => {
    // Implement add task functionality
  };

  return (
    <div>
      
      <div className="project-grid">
      <div className="default project-container">
        <button onClick={handleOpenModal}>Create Project</button>
      </div>
        <div className="project-container">
          <h3>Project Title</h3>
          <p>Description of the project.</p>
          <p>Deadline: YYYY-MM-DD</p>
          <div className="project-actions">
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleAddTask}>Add Task</button>
          </div>
        </div>
        <div className="project-container">
          <h3>Project Title</h3>
          <p>Description of the project.</p>
          <p>Deadline: YYYY-MM-DD</p>
          <div className="project-actions">
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleAddTask}>Add Task</button>
          </div>
        </div>
        <div className="project-container">
          <h3>Project Title</h3>
          <p>Description of the project.</p>
          <p>Deadline: YYYY-MM-DD</p>
          <div className="project-actions">
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleAddTask}>Add Task</button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>X</button>
            <CreateProjects token={token} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
