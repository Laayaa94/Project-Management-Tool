import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';
import { FaBell } from 'react-icons/fa';
import Notification from '../Notifications/Notifications';
import logo from '../../Assets/taskMaster.png';

const NavBar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

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
          <FaBell onClick={toggleNotification} className='notifiIcon' />
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
