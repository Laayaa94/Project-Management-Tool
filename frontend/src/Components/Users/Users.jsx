import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Users.css';

const Users = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [emailSearch, setEmailSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [emailAdd, setEmailAdd] = useState('');
  const [position, setPosition] = useState('');
  const [userId, setUserId] = useState('');
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  useEffect(() => {
    const decodedToken = parseJwt(token); // Example function to decode JWT token
    if (decodedToken && decodedToken.id) {
      setUserId(decodedToken.id); // Assuming 'id' is the user ID in the token
    }
  }, [token]);

  useEffect(() => {
    if (userId) {
      fetchTeamMembers();
    }
  }, [userId]);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/teamMembers/${userId}/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
      // Handle error (show message, etc.)
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/email/${emailSearch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setSearchResult(response.data);
    } catch (error) {
      console.error('Error searching user by email:', error);
      // Handle error (show message, etc.)
    }
  };

  const handleAddTeamMember = async () => {
    if (!searchResult) {
      console.error('No search result to add');
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/teamMembers/${userId}/add`,
        {
          memberId: searchResult._id,
          position: position,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      fetchTeamMembers(); // Refresh team members after adding a new member
      setEmailAdd('');
      setPosition('');
      setSearchResult(null); // Clear the search result after adding the member
    } catch (error) {
      console.error('Error adding team member:', error);
      // Handle error (show message, etc.)
    }
  };

  const handleRemoveTeamMember = async (memberId) => {
    try {
      await axios.delete(`http://localhost:5000/api/teamMembers/${userId}/remove/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchTeamMembers(); // Refresh team members after removing a member
    } catch (error) {
      console.error('Error removing team member:', error);
      // Handle error (show message, etc.)
    }
  };

  return (
    <div className="container">
      <h2>Team Members</h2>
      <div className="member-search-and-add">
     
     <div className="sections">
    

      {/* Add Team Member */}
      <section className='form'>
        <h2>Add Team Member</h2>
        <input
          type="text"
          value={emailAdd}
          onChange={(e) => setEmailAdd(e.target.value)}
          placeholder="Enter email"
        />
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Enter the Role"
        />
        <button onClick={handleAddTeamMember}>Add Team Member</button>
      </section>
      <section className='search'>
        <h2>Search Team Member</h2>
        <input
          type="text"
          value={emailSearch}
          onChange={(e) => setEmailSearch(e.target.value)}
          placeholder="Enter Email"
        />
        <button onClick={handleSearch}>Search</button>
        {searchResult && (
          <div className="search-result">
            <p>Name: {searchResult.name}</p>
            <p>Email: {searchResult.email}</p>
            <p>Title: {searchResult.role}</p>
          </div>
        )}
      </section>
     </div>
     
      </div>

      {/* Display Team Members */}
      <section>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Title</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member, index) => (
              <tr key={member._id}>
                <td>{index + 1}</td>
                <td>{member.memberId.name}</td>
                <td>{member.memberId.email}</td>
                <td>{member.memberId.role}</td>
                <td>{member.position}</td>
                <td>
                  <button onClick={() => handleRemoveTeamMember(member.memberId._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Users;

// Example function to decode JWT token
function parseJwt(token) {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  if (!base64Url) return null;
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(window.atob(base64));
}
