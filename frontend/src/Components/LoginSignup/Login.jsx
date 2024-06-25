import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'

const Login = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = state === "Sign Up" ? 'http://localhost:5000/auth/signup' : 'http://localhost:5000/auth/login';
    axios.post(endpoint, formData)
      .then(response => {
        console.log('Success:', response.data);
        // Handle success (e.g., store token, redirect)
        localStorage.setItem('token', response.data.token); // Example: Store token in localStorage
        // Redirect to /main after successful login
        window.location.href = '/main';
      })
      .catch(error => {
        console.error('Error:', error.response.data);
        alert("Invalid Email or Password");
      })
      .finally(() => {
        // Reset form input fields after submission (successful or not)
        setFormData({
          name: '',
          email: '',
          password: '',
          role: ''
        });
      });
  };

  return (
    <div className='login-container'>
      <h1>{state}</h1>
      <form onSubmit={handleSubmit}>
        {state === "Sign Up" && (
          <input
            type="text"
            placeholder='Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          placeholder='Email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder='Password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          required
        />
        {state === "Sign Up" && (
          <input
            type="text"
            placeholder='Your Role'
            name='role'
            value={formData.role}
            onChange={handleChange}
            required
          />
        )}
        <button type='submit'>Continue</button>
      </form>
      {state === "Sign Up" ? (
        <p>
          Already have an account? 
          <span onClick={() => { setState("Login") }}>Login here</span>
        </p>
      ) : (
        <p>
          Create an account? 
          <span onClick={() => { setState("Sign Up") }}>Click here</span>
        </p>
      )}
    </div>
  );
}

export default Login;
