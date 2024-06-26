// controllers/projectController.js

const Project = require('../models/Project');


//Project Create
const createProject = async (req, res) => {
  const {
     title, 
     description, 
     position,
     deadline } = req.body;
  const createdBy = req.user; // This will be set by the authenticateUser middleware

  try {
    const newProject = await Project.create({
      title,
      description,
      position,
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


// Get all projects for the authenticated user
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error getting projects:", error);
    res.status(500).json({ message: 'Failed to get projects', error: error.message });
  }
};


// Get a single project by ID
const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findOne({ _id: id, createdBy: req.user._id });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error getting project:", error);
    res.status(500).json({ message: 'Failed to get project', error: error.message });
  }
};


// Update a project by ID
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, position,deadline } = req.body;

  try {
    const project = await Project.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { title, description, position,deadline, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', error: error.message });
    } else {
      console.error("Error updating project:", error);
      res.status(500).json({ message: 'Failed to update project', error: error.message });
    }
  }
};

// Delete a project by ID
const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findOneAndDelete({ _id: id, createdBy: req.user._id });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
};

//get projects count

const getProjectCounts = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming authenticated user ID is available in req.user._id

    const todoCount = await Project.countDocuments({ createdBy: userId, position: 'To Do' });
    const inProgressCount = await Project.countDocuments({ createdBy: userId, position: 'In Progress' });
    const completeCount = await Project.countDocuments({ createdBy: userId, position: 'Complete' });

    res.status(200).json({ todo: todoCount, inProgress: inProgressCount, complete: completeCount });
  } catch (error) {
    console.error('Error fetching project counts:', error);
    res.status(500).json({ error: 'Error fetching project counts' });
  }
};




module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectCounts,
}