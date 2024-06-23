const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const  authenticate  = require('../middleware/authmiddleware');

// Create a new task
router.post('/create', authenticate, taskController.createTask);

// Get all tasks for a project
router.get('/get/:projectId', authenticate, taskController.getTasks);

// Get a single task by ID
router.get('/:taskId', authenticate, taskController.getTaskById);

// Update a task
router.put('/:taskId', authenticate, taskController.updateTask);

// Delete a task
router.delete('/:taskId', authenticate, taskController.deleteTask);

module.exports = router;
