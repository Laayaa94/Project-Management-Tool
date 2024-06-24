import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ taskCounts, projectCounts }) => {
    const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (taskCounts && projectCounts) {
      const data = {
        labels: ['To Do', 'In Progress', 'Complete'],
        datasets: [
          {
            label: 'Tasks',
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            data: [taskCounts.todo, taskCounts.inProgress, taskCounts.complete],
          },
          {
            label: 'Projects',
            backgroundColor: ['#4BC0C0', '#FF8C00', '#9966FF'],
            hoverBackgroundColor: ['#4BC0C0', '#FF8C00', '#9966FF'],
            data: [projectCounts.todo, projectCounts.inProgress, projectCounts.complete],
          },
        ],
      };

      setChartData(data);
    }
  }, [taskCounts, projectCounts]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'right',
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };
  return (
    <div className="pie-chart-container">
    <h2>Task and Project Status Distribution</h2>
    {chartData ? <Pie data={chartData} options={options} /> : <p>Loading chart...</p>}
  </div>
  )
}

export default PieChart
