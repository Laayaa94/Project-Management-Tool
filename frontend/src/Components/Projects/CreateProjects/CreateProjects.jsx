import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateProjects.css'; // Ensure this file is correctly imported
import createProject from '../../../Assets/create-project.jpg';
import editProject from '../../../Assets/edit-project.jpg';

const CreateProjects = ({ token, editingProject }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    position: 'To Do' // Default position
  });

  // Populate form fields with editingProject data when it changes
  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title,
        description: editingProject.description,
        deadline: editingProject.deadline ? editingProject.deadline.substring(0, 10) : '', // Format deadline to YYYY-MM-DD
        position: editingProject.position || 'To Do'
      });
    }
  }, [editingProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, description, deadline, position } = formData;
    if (!title || !description || !deadline || !position) {
      console.error('Please fill out all fields.');
      return;
    }

    if (editingProject) {
      axios.put(`http://localhost:5000/api/projects/update/${editingProject._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Project updated:', response.data);
        setFormData({
          title: '',
          description: '',
          deadline: '',
          position: 'To Do'
        });
      })
      .catch(error => {
        console.error('Error updating project:', error);
      });
    } else {
      axios.post('http://localhost:5000/api/projects/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Project created:', response.data);
        setFormData({
          title: '',
          description: '',
          deadline: '',
          position: 'To Do'
        });
      })
      .catch(error => {
        console.error('Error creating project:', error);
      });
    }
  };

  return (
    <div className='create-project-container'>
      <div className="left-container-create-project">
      <img src={editingProject ? editProject : createProject} alt={editingProject ? "Edit Project" : "Create Project"} />
      </div>
      <div className="right-container-create-project">
        <h2>{editingProject ? 'Edit Project' : 'Create Project'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Project Name"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
          <button type="submit">{editingProject ? 'Update Project' : 'Add Project'}</button>
        </form>
      </div>
    </div>
  );
};

export default CreateProjects;
