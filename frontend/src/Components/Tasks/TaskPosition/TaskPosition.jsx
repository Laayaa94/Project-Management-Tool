import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskPosition.css'
const TaskPosition = ({ position }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/tasks/mytasks/${position}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [position]); // Update tasks when position changes

  const handleUpdatePosition = async (taskId, newPosition) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { position: newPosition },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      if (response.status === 200) {
        // Update local tasks state to reflect the new position
        const updatedTasks = tasks.map(task => {
          if (task._id === taskId) {
            return { ...task, position: newPosition };
          }
          return task;
        });
        setTasks(updatedTasks);
        console.log('Task position updated successfully');
      } else {
        console.error('Error updating task position');
      }
    } catch (error) {
      console.error('Error updating task position:', error);
    }
  };

  const getGradientBackground = (position) => {
    switch (position) {
      case 'To Do':
        return ' #e74d3c0e';
      case 'In Progress':
        return '#3498db1d';
      case 'Complete':
        return '#97f3d421';
      default:
        return '#fff';
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='task-list-position'>
      <h1>My Tasks - {position}</h1>
      <div className="task-list">
        {tasks.map(task => (
          <div
          key={task._id}
          className="task-item-position"
          style={{ backgroundColor: getGradientBackground(task.position) }}
        >
          <div className="owner-title-display-flex">
            <h3>{task.title}</h3>
            <p><strong>Owner:</strong> {task.createdBy ? task.createdBy.name : 'N/A'}</p>
          </div>
          <p>{task.description}</p>
          <div className="task-actions">
            <select
              className="position-select"
              style={{ backgroundColor: task.position === 'To Do' ? '#e74d3c7d' : 
                       task.position === 'In Progress' ? '#3498db6d' : 
                       task.position === 'Complete' ? '#2ecc7062' : '#f0f0f0' }}
              value={task.position}
              onChange={(e) => handleUpdatePosition(task._id, e.target.value)}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
            <p><strong>Deadline:</strong> {task.deadline ? formatDate(task.deadline) : 'Not specified'}</p>
          </div>

          </div>
        ))}
      </div>
    </div>
  );

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`; // Add leading zero if month is single digit
    }
    let day = date.getDate();
    if (day < 10) {
      day = `0${day}`; // Add leading zero if day is single digit
    }
    return `${year}-${month}-${day}`;
  }
};

export default TaskPosition;
