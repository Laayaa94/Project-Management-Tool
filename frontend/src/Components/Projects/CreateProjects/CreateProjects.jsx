import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateProjects = ({ token, editingProject }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: ''
  });

  // Populate form fields with editingProject data when it changes
  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title,
        description: editingProject.description,
        deadline: editingProject.deadline ? editingProject.deadline.substring(0, 10) : '' // Format deadline to YYYY-MM-DD
      });
    }
  }, [editingProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure all required fields are included in formData
    const { title, description, deadline } = formData;
    if (!title || !description || !deadline) {
      console.error('Please fill out all fields.');
      return;
    }

    if (editingProject) {
      // If editingProject exists, update the existing project
      axios.put(`http://localhost:5000/api/projects/update/${editingProject._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Project updated:', response.data);
        // Reset the form after successful submission
        setFormData({
          title: '',
          description: '',
          deadline: ''
        });
        // Optionally, fetch updated project list or navigate to another page
      })
      .catch(error => {
        console.error('Error updating project:', error);
        // Handle error
      });
    } else {
      // If editingProject is null, create a new project
      axios.post('http://localhost:5000/api/projects/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Project created:', response.data);
        // Reset the form after successful submission
        setFormData({
          title: '',
          description: '',
          deadline: ''
        });
        // Optionally, fetch updated project list or navigate to another page
      })
      .catch(error => {
        console.error('Error creating project:', error);
        // Handle error
      });
    }
  };

  return (
    <div>
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
        <button type="submit">{editingProject ? 'Update Project' : 'Add Project'}</button>
      </form>
    </div>
  );
};

export default CreateProjects;
