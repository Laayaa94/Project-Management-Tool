import React, { useState } from 'react';
import axios from 'axios';

const CreateProjects = ({ token }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    teamMembers: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/projects', formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Project created:', response.data);
      // Reset the form after successful submission
      setFormData({
        name: '',
        description: '',
        deadline: '',
        teamMembers: ''
      });
      // Handle success, e.g., update the project list or navigate to another page
    })
    .catch(error => {
      console.error('Error creating project:', error);
      // Handle error, e.g., show a notification to the user
    });
  };

  return (
    <div>
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={formData.name}
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
        
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
}

export default CreateProjects;
