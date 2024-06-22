import React, { useState } from 'react'

const Login = () => {
  const [state,setState]=useState("Sign Up");
  return (
    <div className='login-container'>
      <h1>{state}</h1>
      {state=== "Sign Up" ? <input type="text" placeholder='Name' /> : <></>}

        <input type="email" placeholder='Email'/>
        <input type="password"  placeholder='Password'/>
        <button>Continue</button>
        
    </div>
  )
}

export default Login
