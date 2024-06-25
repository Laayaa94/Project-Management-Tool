import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SideNavBar.css';
import Avatar from '../../Assets/avatar.png';

const SideNavBar = ({ token }) => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserEmail = () => {
      try {
        const decodedToken = parseJwt(token);
        if (decodedToken && decodedToken.email) {
          setUserEmail(decodedToken.email);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };

    fetchUserEmail();
  }, [token]);

  return (
    <div className='sidenavBar'>
      <div className="profile-img-and-email">
        <img src={Avatar} alt="Profile" />
        <h3>{userEmail}</h3>
      </div>
      <ul>
        <li>
          <Link to="/main">Dashboard</Link>
        </li>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
        <li>
          <Link to="/tasks">Tasks</Link>
        </li>
        <li>
          <Link to="/complete">Completed</Link>
        </li>
        <li>
          <Link to="/todo">To do</Link>
        </li>
        <li>
          <Link to="/inprogress">In Progress</Link>
        </li>
        <li>
          <Link to="/users">Members</Link>
        </li>
      </ul>
    </div>
  );
};

export default SideNavBar;

function parseJwt(token) {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  if (!base64Url) return null;
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
}
