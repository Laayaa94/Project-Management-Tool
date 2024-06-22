import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [state, setState] = useState("Sign Up");
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
    const { name, email, password, role } = formData;
    const url = state === "Sign Up" ? '/auth/signup' : '/auth/login';
    axios.post(url, { name, email, password, role })
      .then(response => {
        console.log('Success:', response.data);
        // Handle success
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle error
      });
  };
  

  return (
    <div className='login-container'>
      <h1>{state}</h1>
      <form onSubmit={handleSubmit}>
        {state === "Sign Up" ? (
          <input
            type="text"
            placeholder='Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
          />
        ) : null}
        <input
          type="email"
          placeholder='Email'
          name='email'
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder='Password'
          name='password'
          value={formData.password}
          onChange={handleChange}
        />
        {state === "Sign Up" ? (
          <input
            type="text"
            placeholder='Your Role'
            name='role'
            value={formData.role}
            onChange={handleChange}
          />
        ) : null}
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
