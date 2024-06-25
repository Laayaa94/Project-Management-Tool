// NavBar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import './NavBar.css';
import { FaBell } from 'react-icons/fa';
import Notification from '../Notifications/Notifications';
import logo from '../../Assets/taskMaster.png';

const NavBar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate(); // Create a navigate function

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  const handleLogin = () => {
    navigate('/login'); // Navigate to /login route
  };

  const handleLogo=()=>{
    navigate('/');
  }
  return (
    <div className='navBar'>
      <nav>
        <img src={logo} alt="Task Master Logo" className='logo'onClick={handleLogo}/>
        <div className="nav-actions">
          <FaBell onClick={toggleNotification} className='notifiIcon' />
          <button onClick={handleLogin}>Login</button>
        </div>
      </nav>
      {showNotification && <Notification onClose={closeNotification} />}
    </div>
  );
};

export default NavBar;
