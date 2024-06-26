import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NavBar.css';
import { FaBell } from 'react-icons/fa';
import Notification from '../Notifications/Notifications';
import logo from '../../Assets/taskMaster.png';

const NavBar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUnreadCount();
    }
  }, []);

  useEffect(() => {
    if (showNotification) {
      markNotificationsAsRead();
    }
  }, [showNotification]);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notification/unread-count', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/notification/markasread', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUnreadCount(0); // Reset unread count locally
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleLogo = () => {
    navigate('/');
  };

  return (
    <div className='navBar'>
      <nav>
        <img src={logo} alt="Task Master Logo" className='logo' onClick={handleLogo} />
        <div className="nav-actions">
          <div className="notificationBell">
            <FaBell onClick={toggleNotification} className='notifiIcon' />
            {unreadCount > 0 && <span className='notificationCount'>{unreadCount}</span>}
          </div>
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <button onClick={handleLogin}>Login</button>
          )}
        </div>
      </nav>
      {showNotification && <Notification onClose={closeNotification} />}
    </div>
  );
};

export default NavBar;
