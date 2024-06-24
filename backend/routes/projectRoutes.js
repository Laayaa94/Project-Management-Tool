// routes/projectRouter.js

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateUser = require('../middleware/authmiddleware'); // Adjust the path as necessary

// Apply authentication middleware to project routes
router.post('/create', authenticateUser, projectController.createProject);
router.get('/get',  authenticateUser,projectController.getProjects);
router.get('/get/:id',  authenticateUser,projectController.getProjectById);
router.put('/update/:id', authenticateUser,projectController.updateProject);
router.delete('/delete/:id', authenticateUser,projectController.deleteProject);
router.get('/counts', authenticateUser, projectController.getProjectCounts);

module.exports = router;
