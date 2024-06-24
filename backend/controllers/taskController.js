const Task = require('../models/Task');
const User = require('../models/User');
const Notification=require('../models/Notification')

// Create a new task
const createTask = async (req, res) => {
  const { title, description, assignedUser, position, projectId, deadline } = req.body;
  const createdBy = req.user._id; // Assuming authenticated user's ID

  try {
    // Check if assignedUser exists
    const user = await User.findById(assignedUser);
    if (!user) {
      return res.status(404).json({ message: 'Assigned user not found' });
    }

    const newTask = new Task({
      title,
      description,
      assignedUser,
      position,
      projectId,
      createdBy,
      deadline,
    });

    await newTask.save();

    // Create notification for assigned user
    await Notification.create({
      userId: assignedUser,
      message: `You have been assigned a new task: ${title}`,
      type: 'assignment',
      taskId: newTask._id,
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

    

// Get all tasks for a project
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ projectId }).populate('assignedUser', 'name email');
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

//Update Task

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, assignedUser, position, deadline } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, assignedUser, position, deadline },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Notify assignedUser if createdBy updated the task
    if (updatedTask.createdBy && updatedTask.createdBy.toString() === req.user._id.toString()) {
      // Check if assignedUser exists and is different from createdBy
      if (updatedTask.assignedUser && updatedTask.assignedUser.toString() !== updatedTask.createdBy.toString()) {
        await Notification.create({
          userId: updatedTask.assignedUser,
          message: `Your task '${updatedTask.title}' has been updated by ${req.user.name}`,
          type: 'update',
          taskId: updatedTask._id,
        });
      }
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
};


// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ assignedUser: userId })
      .populate('projectId', 'name')
      .populate('createdBy', 'name email');
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching assigned tasks:', error);
    res.status(500).json({ error: 'Error fetching assigned tasks' });
  }
};


// Controller function to get tasks in "To Do" position
const getToDoTasks = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming authenticated user ID is available in req.user._id
    const tasks = await Task.find({ assignedUser: userId, position: 'To Do' })
      .populate('projectId', 'name')
      .populate('createdBy', 'name email');
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching To Do tasks:', error);
    res.status(500).json({ error: 'Error fetching To Do tasks' });
  }
};

// Controller function to get tasks in "In Progress" position
const getInProgressTasks = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming authenticated user ID is available in req.user._id
    const tasks = await Task.find({ assignedUser: userId, position: 'In Progress' })
      .populate('projectId', 'name')
      .populate('createdBy', 'name email');
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching In Progress tasks:', error);
    res.status(500).json({ error: 'Error fetching In Progress tasks' });
  }
};

// Controller function to get tasks in "Complete" position
const getCompleteTasks = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming authenticated user ID is available in req.user._id
    const tasks = await Task.find({ assignedUser: userId, position: 'Complete' })
      .populate('projectId', 'name')
      .populate('createdBy', 'name email');
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching Complete tasks:', error);
    res.status(500).json({ error: 'Error fetching Complete tasks' });
  }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId).populate('assignedUser', 'name email');
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Error fetching task' });
  }
};
const getTaskCounts = async (req, res) => {
  try {
    const counts = await Task.aggregate([
      { $group: { _id: '$position', count: { $sum: 1 } } }
    ]);

    const result = {
      todo: 0,
      inProgress: 0,
      complete: 0
    };

    counts.forEach(item => {
      if (item._id === 'To Do') {
        result.todo = item.count;
      } else if (item._id === 'In Progress') {
        result.inProgress = item.count;
      } else if (item._id === 'Complete') {
        result.complete = item.count;
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching task counts:', error);
    res.status(500).json({ error: 'Error fetching task counts' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getMyTasks,
  getToDoTasks,
  getInProgressTasks,
  getCompleteTasks,
  getTaskCounts,
};
