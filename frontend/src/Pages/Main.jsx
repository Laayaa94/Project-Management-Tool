import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Main = () => {
  const [taskCounts, setTaskCounts] = useState({ todo: 0, inProgress: 0, complete: 0 });
  const [projectCounts, setProjectCounts] = useState({ todo: 0, inProgress: 0, complete: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    const fetchTaskCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks/counts', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setTaskCounts(response.data);
      } catch (error) {
        console.error('Error fetching task counts:', error);
      }
    };

    const fetchProjectCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects/counts', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setProjectCounts(response.data);
      } catch (error) {
        console.error('Error fetching project counts:', error);
      }
    };

    if (token) {
      fetchTaskCounts();
      fetchProjectCounts();
    }
  }, []);

  // Data for Task Pie Chart
  const taskData = {
    labels: ['To Do', 'In Progress', 'Complete'],
    datasets: [
      {
        label: 'Task Status',
        data: [taskCounts.todo, taskCounts.inProgress, taskCounts.complete],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  // Data for Project Pie Chart
  const projectData = {
    labels: ['To Do', 'In Progress', 'Complete'],
    datasets: [
      {
        label: 'Project Status',
        data: [projectCounts.todo, projectCounts.inProgress, projectCounts.complete],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div>
      <h1>Dashboard</h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <div style={{ width: '45%' }}>
          <h2>Task Counts</h2>
          <p>To Do: {taskCounts.todo}</p>
          <p>In Progress: {taskCounts.inProgress}</p>
          <p>Complete: {taskCounts.complete}</p>
          <Pie data={taskData} />
        </div>
        <div style={{ width: '45%' }}>
          <h2>Project Counts</h2>
          <p>To Do: {projectCounts.todo}</p>
          <p>In Progress: {projectCounts.inProgress}</p>
          <p>Complete: {projectCounts.complete}</p>
          <Pie data={projectData} />
        </div>
      </div>
    </div>
  );
};

export default Main;
