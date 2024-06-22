// routes/projectRouter.js

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateUser = require('../middleware/authmiddleware'); // Adjust the path as necessary

// Apply authentication middleware to project routes
router.post('/create', authenticateUser, projectController.createProject);

module.exports = router;
