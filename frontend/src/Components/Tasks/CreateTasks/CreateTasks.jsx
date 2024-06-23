import React, { useState, useEffect } from 'react';

const CreateTasks = ({ projectId, token, projectTitle, projectDescription, projectDeadline }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedUserEmail, setAssignedUserEmail] = useState('');
  const [taskPosition, setTaskPosition] = useState('To Do'); // New state for task position
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/get', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/get/${projectId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const tasksData = await response.json();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const selectedUser = users.find(user => user.email === assignedUserEmail);
    if (!selectedUser) {
      console.error('Selected user not found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          assignedUser: selectedUser._id,
          position: taskPosition, // Include task position
          projectId
        })
      });
      if (response.ok) {
        fetchTasks(); // Refresh tasks after creation
        setTaskTitle('');
        setTaskDescription('');
        setAssignedUserEmail('');
        setTaskPosition('To Do'); // Reset task position to default
      } else {
        console.error('Error creating task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setAssignedUserEmail(email);
    setFilteredUsers(users.filter(user => user.email.toLowerCase().includes(email.toLowerCase())));
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
          <input 
            type="text" 
            value={assignedUserEmail} 
            onChange={handleEmailChange} 
            required 
          />
          {filteredUsers.length > 0 && (
            <ul className="email-suggestions">
              {filteredUsers.map(user => (
                <li key={user._id} onClick={() => setAssignedUserEmail(user.email)}>
                  {user.email}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label>Task Position:</label>
          <select value={taskPosition} onChange={(e) => setTaskPosition(e.target.value)} required>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
        </div>
        <button type="submit">Create Task</button>
      </form>
      <h2>Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Assigned to: {task.assignedUser.email}</p>
            <p>Position: {task.position}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateTasks;
