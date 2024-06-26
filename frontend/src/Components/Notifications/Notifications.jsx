import React, { useEffect, useState } from 'react';
import './Notifications.css'
import {  FaCut, FaTrash } from 'react-icons/fa'; // Import icons for edit and delete


const Notifications = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notification/mynotifications', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const notifications = await response.json();
        setNotifications(notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Handle error (e.g., show error message)
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  return (
    <div className="notification">
      <div className="topic-button-notifi">
        <h4>Your Notifications</h4>
      <button onClick={onClose}>Close</button>
      </div>
      {notifications.map(notification => (
        <div key={notification._id} className='display-flex-notification'>
          <p>{notification.message}</p>
          <button onClick={() => handleDelete(notification._id)} className='removeX'>X</button>
        </div>
      ))}
      
    </div>
  );

  async function handleDelete(notificationId) {
    try {
      const response = await fetch(`http://localhost:5000/api/notification/${notificationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
      // Update state or re-fetch notifications after deletion
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Handle error (e.g., show error message)
    }
  }
};

export default Notifications;
