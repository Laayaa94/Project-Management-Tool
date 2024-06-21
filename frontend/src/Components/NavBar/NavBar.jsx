import React from 'react'
import './Navbar.css'
import logo from '../../Assets/logo.png'
const NavBar = () => {
  return (
    <div className='navbar'>
      <img src={logo} alt="" />
      <button>Login</button>
     
    </div>
  )
}

export default NavBar
