import React, { useEffect, useState } from 'react';
import './Main.css';

const Main = () => {
  const [taskCounts, setTaskCounts] = useState({
    todo: 0,
    inProgress: 0,
    complete: 0
  });

  const [projectCounts, setProjectCounts] = useState({
    todo: 0,
    inProgress: 0,
    complete: 0
  });

  useEffect(() => {
    const fetchTaskCounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tasks/counts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch task counts');
        }
        const data = await response.json();
        setTaskCounts(data);
      } catch (error) {
        console.error('Error fetching task counts:', error);
        // Handle error (e.g., show error message)
      }
    };

    const fetchProjectCounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects/counts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch project counts');
        }
        const data = await response.json();
        setProjectCounts(data);
      } catch (error) {
        console.error('Error fetching project counts:', error);
        // Handle error (e.g., show error message)
      }
    };

    fetchTaskCounts();
    fetchProjectCounts();
  }, []);

  return (
    <div className='mainPage'>
      <div className='taskSection'>
        <h2>Tasks</h2>
        <div className='taskCounts'>
          <div className='taskCategory'>
            <h3>To Do</h3>
            <p>{taskCounts.todo}</p>
          </div>
          <div className='taskCategory'>
            <h3>In Progress</h3>
            <p>{taskCounts.inProgress}</p>
          </div>
          <div className='taskCategory'>
            <h3>Complete</h3>
            <p>{taskCounts.complete}</p>
          </div>
        </div>
      </div>
      <div className='projectSection'>
        <h2>Projects</h2>
        <div className='projectCounts'>
          <div className='projectCategory'>
            <h3>To Do</h3>
            <p>{projectCounts.todo}</p>
          </div>
          <div className='projectCategory'>
            <h3>In Progress</h3>
            <p>{projectCounts.inProgress}</p>
          </div>
          <div className='projectCategory'>
            <h3>Complete</h3>
            <p>{projectCounts.complete}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
