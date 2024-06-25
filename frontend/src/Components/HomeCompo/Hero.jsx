import React from 'react'
import './Hero.css'
import { useNavigate } from 'react-router-dom';
const Hero = () => {
  const navigate = useNavigate();
  const handleStartNow=()=>{
   navigate('/login')
  }
  return (
    <div className='hero'>
      <div className="heroLeft">
        <h3>Manage Your</h3>
        <h1>Projects & Tasks</h1>
        <h3>Track Progress</h3>
        <p>Streamline workflow, boost collaboration, meet deadlines.
          <br /> From tasks to progress, everything to succeed.
          <br />  Transform your work.</p>
          <button onClick={handleStartNow}>Start Now</button>

      </div>
      
    </div>
  )
}

export default Hero
