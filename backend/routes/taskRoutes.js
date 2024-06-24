const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticate = require('../middleware/authmiddleware');

// Create a new task
router.post('/create', authenticate, taskController.createTask);

// Get all tasks for a project
router.get('/get/:projectId', authenticate, taskController.getTasks);

// Update a task
router.put('/:taskId', authenticate, taskController.updateTask);

// Delete a task
router.delete('/:taskId', authenticate, taskController.deleteTask);

// Get all tasks assigned to the logged-in user
router.get('/mytasks', authenticate, taskController.getMyTasks);

// Get tasks in "To Do" position assigned to the logged-in user
router.get('/mytasks/todo', authenticate, taskController.getToDoTasks);

// Get tasks in "In Progress" position assigned to the logged-in user
router.get('/mytasks/inprogress', authenticate, taskController.getInProgressTasks);

// Get tasks in "Complete" position assigned to the logged-in user
router.get('/mytasks/complete', authenticate, taskController.getCompleteTasks);

// Get task counts for "To Do", "In Progress", "Complete"
router.get('/counts', authenticate, taskController.getTaskCounts);

// Get a single task by ID
router.get('/:taskId', authenticate, taskController.getTaskById);

module.exports = router;
