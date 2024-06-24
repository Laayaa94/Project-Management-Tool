// NavBar.js
import React, { useState } from 'react';
import './NavBar.css';
import { FaBell } from 'react-icons/fa';
import Notification from '../Notifications/Notifications';

const NavBar = () => {
  const [showNotification, setShowNotification] = useState(false);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className='navBar'>
      <nav>
        <h1>Logo</h1>
        <div className="nav-actions">
          <button onClick={toggleNotification}>
            <FaBell />
          </button>
          <button>Login</button>
        </div>
      </nav>
      {showNotification && <Notification onClose={closeNotification} />}
    </div>
  );
};

export default NavBar;
