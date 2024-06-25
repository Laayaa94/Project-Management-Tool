import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Main.css'
import { FaAngleDoubleRight, FaBook, FaCheck, FaCheckCircle, FaCheckDouble, FaClock, FaNetworkWired, FaPenFancy, FaPencilAlt, FaProjectDiagram, FaTags, FaTasks, FaUserEdit, FaUserSlash, FaUsers } from 'react-icons/fa';
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
    <div className='main'>
      
      <div className="task-project-progress-all">
        <div className="task-project-progress">
          <h1>To Do <FaPencilAlt/> </h1>
        <div className="project-task">
        <p> <div className="fabook"> <FaBook/></div>Projects:{projectCounts.todo}</p>
        <p> <div className="fatasks"> <FaTasks/></div>Tasks: {taskCounts.todo}</p>
          
        </div>
        </div>

        <div className="task-project-progress">
          <h1>In Progress <FaClock/></h1>
          <div className="project-task">
          <p> <div className="fabook"> <FaBook/></div>Projects: {projectCounts.inProgress}</p>
          <p> <div className="fatasks"> <FaTasks/></div>Tasks: {taskCounts.inProgress}</p>
          </div>
       
        </div>

        <div className="task-project-progress">
          <h1>Complete <FaCheckCircle/></h1>
          <div className="project-task">
          <p> <div className="fabook"> <FaBook/></div>Projects: {projectCounts.complete}</p>
         <p> <div className="fatasks"> <FaTasks/></div>Tasks: {taskCounts.complete}</p>
          </div>
        </div>
      </div>

      <div className="task-project-progress-analysis">
        <div className="charts">
          <h1>Projects</h1>
        <Pie data={projectData} />
        </div>
        <div className="charts">
          <h1>Tasks</h1>
        <Pie data={taskData} />
          </div>
      </div>

  
    </div>
  );
};

export default Main;
