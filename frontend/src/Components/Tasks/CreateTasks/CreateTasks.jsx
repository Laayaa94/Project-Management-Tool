import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons for edit and delete
import './CreateTasks.css'
const CreateTasks = ({ projectId, token, projectTitle, projectDescription, projectDeadline }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedUserEmail, setAssignedUserEmail] = useState('');
  const [taskPosition, setTaskPosition] = useState('To Do');
  const [taskDeadline, setTaskDeadline] = useState(''); // State for task deadline
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false); // State to manage task creation status
  const [editingTaskId, setEditingTaskId] = useState(null); // State to manage editing task id

  useEffect(() => {
    const decodedToken = parseJwt(token);
    if (decodedToken && decodedToken.id) {
      setUserId(decodedToken.id);
    }
  }, [token]);

  useEffect(() => {
    if (userId) {
      fetchTeamMembers();
      fetchTasks();
    }
  }, [userId]);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/teamMembers/${userId}/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/get/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    // Prevent duplicate submissions
    if (isCreatingTask) {
      return;
    }
    setIsCreatingTask(true);

    const selectedUser = teamMembers.find(member => member.memberId.email === assignedUserEmail);
    if (!selectedUser) {
      console.error('Selected user not found');
      setIsCreatingTask(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/tasks/create`,
        {
          title: taskTitle,
          description: taskDescription,
          assignedUser: selectedUser.memberId._id,
          position: taskPosition,
          deadline: taskDeadline, // Pass task deadline to backend
          projectId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        fetchTasks(); // Refresh tasks after creation
        // Reset form fields
        setTaskTitle('');
        setTaskDescription('');
        setAssignedUserEmail('');
        setTaskPosition('To Do');
        setTaskDeadline('');
        alert("Task created succussfully")
      } else {
        console.error('Error creating task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsCreatingTask(false); // Reset isCreatingTask state after request completes
    }
  };

  const handleEditTask = async (taskId) => {
    setEditingTaskId(taskId);
    const taskToEdit = tasks.find(task => task._id === taskId);
    if (taskToEdit) {
      setTaskTitle(taskToEdit.title);
      setTaskDescription(taskToEdit.description);
      setAssignedUserEmail(taskToEdit.assignedUser.email);
      setTaskPosition(taskToEdit.position);
      setTaskDeadline(taskToEdit.deadline ? taskToEdit.deadline.substring(0, 10) : '');
    } else {
      console.error('Task not found for editing');
    }
  };

  const handleUpdateTask = async () => {
    try {
      const selectedUser = teamMembers.find(member => member.memberId.email === assignedUserEmail);
      if (!selectedUser) {
        console.error('Selected user not found');
        return;
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${editingTaskId}`,
        {
          title: taskTitle,
          description: taskDescription,
          assignedUser: selectedUser.memberId._id,
          position: taskPosition,
          deadline: taskDeadline, // Pass task deadline to backend
          projectId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.status === 200) {
        console.log('Task updated successfully');
        fetchTasks(); // Refresh tasks after update
        // Reset form fields
        setTaskTitle('');
        setTaskDescription('');
        setAssignedUserEmail('');
        setTaskPosition('To Do');
        setTaskDeadline('');
        setEditingTaskId(null); // Reset editing task id
      } else {
        console.error('Error updating task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        console.log('Task deleted successfully');
        fetchTasks(); // Refresh tasks after deletion
      } else {
        console.error('Error deleting task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTaskId) {
      handleUpdateTask();
    } else {
      handleCreateTask(e);
    }
  };

  return (
    <div className='create-task-container '>
     <div className="left-Part-create-task">
      <div className="left-part-create-task-top">
      <h1>{projectTitle}</h1>
      <h4>{projectDescription}</h4>
      <p>Deadline: {projectDeadline}</p>
      </div>
      <div className="left-part-create-task-bottom">
      <form onSubmit={handleSubmit}>
      <h2> {editingTaskId ? 'Update Task' : 'Assign Task'}</h2>
        <div>
          <input
            type="text"
            value={taskTitle}
            placeholder="Task Title"
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            value={taskDescription}
            placeholder="Task Description"
            onChange={(e) => setTaskDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="date"
            value={taskDeadline}
            onChange={(e) => setTaskDeadline(e.target.value)}
          />
        </div>
        <div>
          <select
            value={assignedUserEmail}
            onChange={(e) => setAssignedUserEmail(e.target.value)}
            required
          >
            <option value="" disabled>
              Assign a team member
            </option>
            {teamMembers.map((member) => (
              <option key={member._id} value={member.memberId.email}>
                {member.memberId.name} ({member.memberId.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={taskPosition}
            onChange={(e) => setTaskPosition(e.target.value)}
            required
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
        </div>
        
        <button type="submit" disabled={isCreatingTask}>
          {editingTaskId ? 'Update Task' : 'Create Task'}
        </button>
      </form>
      </div>
     </div>
     <div className="right-part-create-tasks">
  <h2>Tasks</h2>
  <ul>
    {tasks.map((task) => (
      <li key={task._id}>
        <div className="task-item-createTasks">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Assigned to: <span style={{ fontWeight: 'bold', color: '#0074e1' }}>{task.assignedUser.name}</span></p>
          <div className="todo-deadline-displaye-flex">
            <p><strong>Position:</strong> {task.position}</p>
            <p style={{ color: 'tomato' }}><strong>Deadline:</strong> {task.deadline ? task.deadline.substring(0, 10) : 'Not specified'}</p>
          </div>
          <div className="edit-delete-icon-assign-tasks-display-flex">
            <button onClick={() => handleEditTask(task._id)}>
              <FaEdit />
            </button>
            <button onClick={() => handleDeleteTask(task._id)}>
              <FaTrash />
            </button>
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>

    </div>
  );
};

export default CreateTasks;



function parseJwt(token) {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  if (!base64Url) return null;
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
}
