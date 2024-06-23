import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons for edit and delete

const CreateTasks = ({ projectId, token, projectTitle, projectDescription, projectDeadline }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedUserEmail, setAssignedUserEmail] = useState('');
  const [taskPosition, setTaskPosition] = useState('To Do');
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false); // State to manage task creation status

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
        fetchTasks();
        setTaskTitle('');  // Reset task title
        setTaskDescription('');  // Reset task description
        setAssignedUserEmail('');  // Reset assigned user email
        setTaskPosition('To Do');  // Reset task position
      } else {
        console.error('Error creating task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsCreatingTask(false); // Reset isCreatingTask state after request completes
    }
  };

  const handleEditTask = (taskId) => {
    // Implement edit task logic here (optional for your requirements)
    console.log('Edit task:', taskId);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}`, {
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

  return (
    <div>
      <h1>{projectTitle}</h1>
      <p>{projectDescription}</p>
      <h4>Deadline: {projectDeadline}</h4>
      <form onSubmit={handleCreateTask}>
        <div>
          <input 
            type="text" 
            value={taskTitle} 
            placeholder='Task Title'
            onChange={(e) => setTaskTitle(e.target.value)} 
            required 
          />
        </div>
        <div>
          <textarea 
            value={taskDescription} 
            placeholder='Task Description'
            onChange={(e) => setTaskDescription(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Assign to User (Email):</label>
          <select value={assignedUserEmail} onChange={(e) => setAssignedUserEmail(e.target.value)} required>
            <option value="" disabled>Select a team member</option>
            {teamMembers.map((member) => (
              <option key={member._id} value={member.memberId.email}>
                {member.memberId.name} ({member.memberId.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Task Position:</label>
          <select value={taskPosition} onChange={(e) => setTaskPosition(e.target.value)} required>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
        </div>
        <button type="submit" disabled={isCreatingTask}>Create Task</button>
      </form>
      <h2>Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Assigned to: {task.assignedUser.email}</p>
              <p>Position: {task.position}</p>
              <div>
                <button onClick={() => handleEditTask(task._id)}><FaEdit /></button>
                <button onClick={() => handleDeleteTask(task._id)}><FaTrash /></button>
              </div>
            </div>
          </li>
        ))}
      </ul>
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
