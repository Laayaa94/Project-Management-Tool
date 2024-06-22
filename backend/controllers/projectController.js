// controllers/projectController.js

const Project = require('../models/Project');

const createProject = async (req, res) => {
  const { title, description, deadline } = req.body;
  const createdBy = req.user; // This will be set by the authenticateUser middleware

  try {
    const newProject = await Project.create({
      title,
      description,
      deadline,
      createdBy: createdBy._id // Use the user ID from the request
    });

    res.status(201).json(newProject);
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle mongoose validation errors
      return res.status(400).json({ message: 'Validation Error', error: error.message });
    } else if (error.code === 11000) {
      // Handle duplicate key error
      return res.status(400).json({ message: 'Duplicate Key Error', error: error.message });
    } else {
      console.error("Error creating project:", error); // Log the actual error for debugging
      res.status(500).json({ message: 'Failed to create project', error: error.message });
    }
  }
};

module.exports = {
  createProject
};
